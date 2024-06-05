import React from 'react';

import { init } from 'commandbar';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import _ from './store/store';
import { editCompanyDetails } from './store/actions';

init('c6396d27');

//navigate commands can be set up in the CommandBar GUI

// useCommandBar is the main functional component
// vlatio is a state management library. It automatically updates the UI when the state changes.
// snapshot is a snapshot of the current state to get info like leads stages etc
// use navigate is a hook to route within the application
const useCommandBar = () => {
  const snapshot = useSnapshot(_);  // gives access to our gloabl store
  const loggedInUserId = '424242';
  // boot command is what makes it visable to a user
  window.CommandBar.boot(loggedInUserId);

  // to prevent browser reloding when navigating we want to hook up
  //commandbar to our client side router
  const navigate = useNavigate();

  // useEffect is used to run side effects in the component
  React.useEffect(() => {
    // takes in url to client side route to that URL
    function router(url: string) {
      navigate(url);
    }

    window.CommandBar.addRouter(router);
  }, [navigate]);  // dependency array showing how router is dependent on navigate

  //There are two ways to make things searchable in commandbar
  // 1. client side: data that is loaded on the client side can be made searchable
  // 2. server side: data that is loaded on the server side can be made searchable by hitting a backend api endpoint

  // this effect runs when the snapshot.companies changes
  //  It adds a context to CommandBar with the key 'leads' and the value of snapshot.companies
  React.useEffect(() => {
    window.CommandBar.addContext('leads', snapshot.companies);
  }, [snapshot.companies]);  // runs whenever snapshot.companies changes

  React.useEffect(() => {
    window.CommandBar.addContext('stages', snapshot.stages);
  }, [snapshot.stages]);

  React.useEffect(() => {
    window.CommandBar.addContext('activeLead', snapshot.activeCompany);
  }, [snapshot.activeCompany]);

  // the empty dependency array means that this effect runs only once when the component is rendered
  // the editCompanyDetails function is defined in our actions to update any company details
  // the context argument here is all of the context that commandbar has access to
  React.useEffect(() => {
    window.CommandBar.addCallback('updateLeadStatus', (args: any, context: any) => {
      const companyId = context.activeLead.id;
      const newStageId = args.stageId.id;  // the args are defined in the function that is created in the GUI
      editCompanyDetails(companyId, 'stageId', newStageId);
    });
  }, []);
};

export default useCommandBar;
