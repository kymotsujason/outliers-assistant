import React, { useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactJson from 'react-json-view';
import UserProfile from './UserProfile';
import './react-tabs.css';
import './Popup.css';
import { Typography } from '@mui/material';

const Popup = () => {
  const [json, setJson] = React.useState(null);
  const [idJson, setIdJson] = React.useState({});
  const [censoredJson, setCensoredJson] = React.useState(null);
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

  // Function to recursively censor sensitive information
  const censor = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(censor);
    } else if (obj && typeof obj === 'object') {
      const newObj = {};
      for (let key in obj) {
        if (sensitiveKeys.includes(key)) {
          newObj[key] = '[CENSORED]';
        } else {
          // Recursively process nested objects
          newObj[key] = censor(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  };

  useEffect(() => {
    const getJson = async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          outlierassistant: 'load',
        });

        // Ensure response and response.outlierassistant are valid
        if (!response || !response.outlierassistant) {
          console.error('Invalid response from chrome.runtime.sendMessage');
          setJson(null);
          return;
        }

        // Parse the response safely
        let parsedData;
        try {
          parsedData = JSON.parse(response.outlierassistant);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          setJson(null);
          return;
        }

        setJson(parsedData);
        // Pass a deep copy to the censor function
        setCensoredJson(censor(parsedData));

        const temp = parsedData.lastEmptyQueueEvent;
        const idJsonTemp = {};

        if (
          temp &&
          temp.currentPrimaryTeamAssignments &&
          typeof temp.currentPrimaryTeamAssignments === 'object'
        ) {
          Object.keys(temp.currentPrimaryTeamAssignments).forEach((key) => {
            const assignment = temp.currentPrimaryTeamAssignments[key];
            if (assignment && assignment.projectId && assignment.projectName) {
              idJsonTemp[assignment.projectId] = assignment.projectName;
            }
          });
        }

        setIdJson(idJsonTemp);
      } catch (error) {
        console.error('Error in getJson:', error);
        setJson(null);
      }
    };

    // Call getJson when the component mounts
    getJson();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="main">
      <Tabs>
        <TabList>
          <Tab>Prettier</Tab>
          <Tab>Raw</Tab>
          <Tab>Censored</Tab>
        </TabList>

        <TabPanel>
          {json ? (
            <UserProfile user={json} idJson={idJson} />
          ) : (
            <Typography>No data available.</Typography>
          )}
        </TabPanel>
        <TabPanel>
          <ReactJson src={json || {}} theme="monokai" />
        </TabPanel>
        <TabPanel>
          <ReactJson src={censoredJson || {}} theme="monokai" />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Popup;
