import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactJson from 'react-json-view';
import UserProfile from './UserProfile';
import './react-tabs.css';
import './Popup.css';
import { Typography, CircularProgress, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { isRecord } from './utils/typeUtils';

// Define type for project ID mapping
type IdJsonType = Record<string, string>;

// Define types for Chrome messaging
interface OutlierAssistantResponse {
  outlierassistant: string;
}

// Move sensitive keys outside the component to avoid unnecessary dependencies
const sensitiveKeys = [
  '_id',
  'id',
  'email',
  'firstName',
  'lastName',
  'phoneNumber',
  'inviteCode',
  'googleOAuthId',
  'workerSlackId',
  'scaleDiscourseId',
  'hubstaffUserId',
  'ostrichHubstaffUserId',
  'googleClickId',
  'acceptedRemoTermsDate',
  'acceptedOutlierTermsDate',
  'lastOnlineDatetime',
  'lastActive',
  'successfulLoginAttempts',
  'hyperwalletUserToken',
  'hyperwalletBankAccountToken',
  'hyperwalletBankAccount4Digits',
  'hyperwalletPaypalToken',
  'hyperwalletPaypalEmail',
  'lastDismissedAnnouncements',
  'phoneNumberAlphabeticCountryCode',
  'phoneNumberCallingCountryCode',
  'localPhoneNumber',
  'verifiedCountryCode',
  'lastPhoneNumberResetDate',
  'greenHouseResumeLink',
  'utmSource',
  'dummyAccountEmails',
  'serverSideRequestId',
  'requestedAt',
  'resolvedAt',
  'lastTriggeredAt',
  'lastTriggerReason',
  'airtmEmail',
  'countryCode',
  'ipCountryCode',
  'createdDate',
  'accountCreditCents',
  'estTotalPayoutCents',
  'requiresMfa',
  'ageRange',
  'remoAdminPersonas',
  'last2FAPhoneVerificationDate',
  'userId',
];

// Custom hook for processing extension data
const useExtensionData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [json, setJson] = useState<unknown>(null);
  const [idJson, setIdJson] = useState<IdJsonType>({});
  const [censoredJson, setCensoredJson] = useState<unknown>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize the censor function
  const censor = useCallback((obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(censor);
    } else if (obj && typeof obj === 'object') {
      const newObj: Record<string, unknown> = {};
      for (const key in obj) {
        if (sensitiveKeys.includes(key)) {
          newObj[key] = '[CENSORED]';
        } else {
          // Recursively process nested objects
          newObj[key] = censor((obj as Record<string, unknown>)[key]);
        }
      }
      return newObj;
    }
    return obj;
  }, []); // No dependencies since sensitiveKeys is defined outside component

  // Extract project IDs from parsed data
  const extractProjectIds = useCallback((parsedData: unknown): IdJsonType => {
    const idJsonTemp: IdJsonType = {};

    if (!isRecord(parsedData)) return idJsonTemp;

    // Try to extract from lastEmptyQueueEvent
    try {
      if (isRecord(parsedData.lastEmptyQueueEvent)) {
        // Check primary team assignments
        if (isRecord(parsedData.lastEmptyQueueEvent.currentPrimaryTeamAssignments)) {
          const assignments = parsedData.lastEmptyQueueEvent.currentPrimaryTeamAssignments;

          Object.entries(assignments).forEach(([, assignment]) => {
            if (
              isRecord(assignment) &&
              typeof assignment.projectId === 'string' &&
              typeof assignment.projectName === 'string'
            ) {
              idJsonTemp[assignment.projectId] = assignment.projectName;
            }
          });
        }

        // Also check secondary team assignments if available
        if (isRecord(parsedData.lastEmptyQueueEvent.currentSecondaryTeamAssignments)) {
          const assignments = parsedData.lastEmptyQueueEvent.currentSecondaryTeamAssignments;

          Object.entries(assignments).forEach(([, assignment]) => {
            if (
              isRecord(assignment) &&
              typeof assignment.projectId === 'string' &&
              typeof assignment.projectName === 'string' &&
              !idJsonTemp[assignment.projectId] // Don't overwrite existing entries
            ) {
              idJsonTemp[assignment.projectId] = assignment.projectName;
            }
          });
        }
      }

      // Also check tieredAssignedProjects if available
      if (isRecord(parsedData.tieredAssignedProjects)) {
        const tieredAssignments = parsedData.tieredAssignedProjects;
        const tiers = ['primary', 'secondary', 'tertiary'];

        tiers.forEach(tier => {
          // Fix type safety issue by using proper checks
          const tierAssignments = tieredAssignments[tier];
          if (Array.isArray(tierAssignments)) {
            tierAssignments.forEach(project => {
              if (
                isRecord(project) &&
                typeof project.projectId === 'string' &&
                typeof project.projectName === 'string' &&
                !idJsonTemp[project.projectId] // Don't overwrite existing entries
              ) {
                idJsonTemp[project.projectId] = project.projectName;
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error extracting project IDs:', error);
      // Continue execution even if extraction fails
    }

    return idJsonTemp;
  }, []);

  // Load data from extension
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Set up a timer for timeout
    let timeoutId: number | undefined;

    try {
      // Send message to background script with timeout handling
      const response = await new Promise<OutlierAssistantResponse>((resolve, reject) => {
        // Create timeout that rejects the promise
        timeoutId = window.setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          reject(new Error('Request timed out after 15 seconds'));
        }, 15000); // 15 seconds timeout

        // Send the message
        chrome.runtime.sendMessage({ outlierassistant: 'load' }, (response: OutlierAssistantResponse | undefined) => {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          // Check for extension error
          if (chrome.runtime.lastError) {
            reject(new Error(`Chrome extension error: ${chrome.runtime.lastError.message}`));
            return;
          }

          if (!response) {
            reject(new Error('Empty response from extension'));
            return;
          }

          resolve(response);
        });

        // Add event listener for abort signal
        signal.addEventListener('abort', () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          reject(new Error('Request aborted'));
        });
      });

      // Process the response
      if (!response.outlierassistant) {
        throw new Error('Invalid response format from extension');
      }

      // Check if response contains an error message
      try {
        const parsedCheck = JSON.parse(response.outlierassistant);
        if (parsedCheck && typeof parsedCheck === 'object' && 'error' in parsedCheck) {
          throw new Error(`Background script error: ${parsedCheck.error}`);
        }
      } catch (parseCheckError) {
        // If this fails, it's likely just not an error object, so continue
        if (parseCheckError instanceof Error && parseCheckError.message.includes('Background script error:')) {
          throw parseCheckError;
        }
      }

      // Parse the JSON response
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(response.outlierassistant);
      } catch (error) {
        // Fix: Include the error details in the thrown error message
        throw new Error(`Error parsing JSON data: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Set the parsed data and censored version
      setJson(parsedData);
      setCensoredJson(censor(parsedData));

      // Extract project IDs
      const extractedIds = extractProjectIds(parsedData);
      setIdJson(extractedIds);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');

      // Reset states on error to ensure we don't have stale data
      setJson(null);
      setCensoredJson(null);
    } finally {
      // Clear any remaining timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [censor, extractProjectIds]);

  // Load data on component mount
  useEffect(() => {
    loadData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  return { loading, error, json, idJson, censoredJson, loadData };
};

const Popup = () => {
  const { loading, error, json, idJson, censoredJson, loadData } = useExtensionData();

  if (loading) {
    return (
      <div
        className="main"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main" style={{ padding: '20px' }}>
        <Typography color="error" variant="h6">
          Error loading data
        </Typography>
        <Typography style={{ marginBottom: '20px' }}>{error}</Typography>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={loadData}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="main">
      <Tabs>
        <TabList>
          <Tab>Prettier</Tab>
          <Tab>Raw</Tab>
          <Tab>Censored</Tab>
        </TabList>

        <TabPanel>
          {json ? <UserProfile user={json} idJson={idJson} /> : <Typography>No data available.</Typography>}
        </TabPanel>
        <TabPanel>
          <ReactJson src={json || {}} theme="monokai" />
        </TabPanel>
        <TabPanel>
          <ReactJson src={censoredJson || {}} theme="monokai" />
        </TabPanel>
      </Tabs>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
        <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={loadData}>
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Popup);
