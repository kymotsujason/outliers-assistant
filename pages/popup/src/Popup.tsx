import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactJson from 'react-json-view';
import UserProfile from './UserProfile';
import Dashboard from './components/dashboard/Dashboard';
import OptionsTab from './components/OptionsTab';
import './react-tabs.css';
import './Popup.css';
import { Typography, CircularProgress, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { isRecord } from './utils/typeUtils';
import { defaultTabStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';

type IdJsonType = Record<string, string>;

interface OutlierAssistantResponse {
  outlierassistant: string;
}

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

const useExtensionData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [json, setJson] = useState<unknown>(null);
  const [idJson, setIdJson] = useState<IdJsonType>({});
  const [censoredJson, setCensoredJson] = useState<unknown>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const censor = useCallback((obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(censor);
    } else if (obj && typeof obj === 'object') {
      const newObj: Record<string, unknown> = {};
      for (const key in obj) {
        if (sensitiveKeys.includes(key)) {
          newObj[key] = '[CENSORED]';
        } else {
          newObj[key] = censor((obj as Record<string, unknown>)[key]);
        }
      }
      return newObj;
    }
    return obj;
  }, []);

  const extractProjectIds = useCallback((parsedData: unknown): IdJsonType => {
    const idJsonTemp: IdJsonType = {};
    if (!isRecord(parsedData)) return idJsonTemp;

    try {
      if (isRecord(parsedData.lastEmptyQueueEvent)) {
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

        if (isRecord(parsedData.lastEmptyQueueEvent.currentSecondaryTeamAssignments)) {
          const assignments = parsedData.lastEmptyQueueEvent.currentSecondaryTeamAssignments;
          Object.entries(assignments).forEach(([, assignment]) => {
            if (
              isRecord(assignment) &&
              typeof assignment.projectId === 'string' &&
              typeof assignment.projectName === 'string' &&
              !idJsonTemp[assignment.projectId]
            ) {
              idJsonTemp[assignment.projectId] = assignment.projectName;
            }
          });
        }
      }

      if (isRecord(parsedData.tieredAssignedProjects)) {
        const tieredAssignments = parsedData.tieredAssignedProjects;
        const tiers = ['primary', 'secondary', 'tertiary'];

        tiers.forEach(tier => {
          const tierAssignments = tieredAssignments[tier];
          if (Array.isArray(tierAssignments)) {
            tierAssignments.forEach(project => {
              if (
                isRecord(project) &&
                typeof project.projectId === 'string' &&
                typeof project.projectName === 'string' &&
                !idJsonTemp[project.projectId]
              ) {
                idJsonTemp[project.projectId] = project.projectName;
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error extracting project IDs:', error);
    }

    return idJsonTemp;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    let timeoutId: number | undefined;

    try {
      const response = await new Promise<OutlierAssistantResponse>((resolve, reject) => {
        timeoutId = window.setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          reject(new Error('Request timed out after 15 seconds'));
        }, 15000);

        chrome.runtime.sendMessage({ outlierassistant: 'load' }, (response: OutlierAssistantResponse | undefined) => {
          if (timeoutId) clearTimeout(timeoutId);

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

        signal.addEventListener('abort', () => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(new Error('Request aborted'));
        });
      });

      if (!response.outlierassistant) {
        throw new Error('Invalid response format from extension');
      }

      try {
        const parsedCheck = JSON.parse(response.outlierassistant);
        if (parsedCheck && typeof parsedCheck === 'object' && 'error' in parsedCheck) {
          throw new Error(`Background script error: ${parsedCheck.error}`);
        }
      } catch (parseCheckError) {
        if (parseCheckError instanceof Error && parseCheckError.message.includes('Background script error:')) {
          throw parseCheckError;
        }
      }

      let parsedData: unknown;
      try {
        parsedData = JSON.parse(response.outlierassistant);
      } catch (error) {
        throw new Error(`Error parsing JSON data: ${error instanceof Error ? error.message : String(error)}`);
      }

      setJson(parsedData);
      setCensoredJson(censor(parsedData));
      setIdJson(extractProjectIds(parsedData));
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setJson(null);
      setCensoredJson(null);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [censor, extractProjectIds]);

  useEffect(() => {
    loadData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  return { loading, error, json, idJson, censoredJson, loadData };
};

const TAB_COUNT = 4; // Number of content tabs (excluding Options)

const Popup = () => {
  const { loading, error, json, idJson, censoredJson, loadData } = useExtensionData();
  const defaultTab = useStorage(defaultTabStorage);
  const [selectedIndex, setSelectedIndex] = useState(() => Math.min(Math.max(defaultTab, 0), TAB_COUNT - 1));

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
      <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Prettier</Tab>
          <Tab>Raw</Tab>
          <Tab>Censored</Tab>
          <Tab>Options</Tab>
        </TabList>

        <TabPanel>
          {json ? <Dashboard user={json} idJson={idJson} /> : <Typography>No data available.</Typography>}
        </TabPanel>
        <TabPanel>
          {json ? <UserProfile user={json} idJson={idJson} /> : <Typography>No data available.</Typography>}
        </TabPanel>
        <TabPanel>
          <ReactJson src={json || {}} theme="monokai" />
        </TabPanel>
        <TabPanel>
          <ReactJson src={censoredJson || {}} theme="monokai" />
        </TabPanel>
        <TabPanel>
          <OptionsTab />
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
