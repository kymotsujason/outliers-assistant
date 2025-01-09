import React, { useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactJson from 'react-json-view';
import UserProfile from './UserProfile';
import './react-tabs.css';
import './Popup.css';

const Popup = () => {
  let [json, setJson] = React.useState(undefined);
  let [idJson, setIdJson] = React.useState({});

  useEffect(() => {
    const getJson = async () => {
      const response = await chrome.runtime.sendMessage({
        outlierassistant: 'load',
      });
      setJson(JSON.parse(response.outlierassistant));
      const temp = JSON.parse(response.outlierassistant).lastEmptyQueueEvent;
      let idJsonTemp = {};
      if (temp) {
        Object.keys(temp.currentPrimaryTeamAssignments).forEach((key) => {
          if (temp.currentPrimaryTeamAssignments[key].projectName) {
            idJsonTemp[temp.currentPrimaryTeamAssignments[key].projectId] =
              temp.currentPrimaryTeamAssignments[key].projectName;
          }
        });
      }
      setIdJson(idJsonTemp);
    };

    if (!json) {
      getJson();
    }
  }, [json]);

  return (
    <div className="main">
      <Tabs>
        <TabList>
          <Tab>Prettier</Tab>
          <Tab>Raw</Tab>
        </TabList>

        <TabPanel>
          {json ? <UserProfile user={json} idJson={idJson} /> : 'No data'}
        </TabPanel>
        <TabPanel>
          <ReactJson src={json} theme="monokai" />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Popup;
