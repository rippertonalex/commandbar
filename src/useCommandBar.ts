import React from 'react';

import { init } from 'commandbar';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import _ from './store/store';
import { editCompanyDetails } from './store/actions';

init('c6396d27');

// useCommandBar is the main functional component
// vlatio is a state management library. It automatically updates the UI when the state changes.
// snapshot is a snapshot of the current state to get info like leads stages etc
// use navigate is a hook to route within the application
const useCommandBar = () => {
  const snapshot = useSnapshot(_);
  const loggedInUserId = '424242';
  window.CommandBar.boot(loggedInUserId);

  const navigate = useNavigate();

  // useEffect is used to run side effects in the component
  React.useEffect(() => {
    function router(url: string) {
      navigate(url);
    }

    window.CommandBar.addRouter(router);
  }, [navigate]);  // dependency array showing how router is dependent on navigate

  // this effect runs when the snapshot.companies changes
  //  It adds a context to CommandBar with the key 'leads' and the value of snapshot.companies
  React.useEffect(() => {
    window.CommandBar.addContext('leads', snapshot.companies);
  }, [snapshot.companies]);

  React.useEffect(() => {
    window.CommandBar.addContext('stages', snapshot.stages);
  }, [snapshot.stages]);

  React.useEffect(() => {
    window.CommandBar.addContext('activeLead', snapshot.activeCompany);
  }, [snapshot.activeCompany]);

  // the empty dependency array means that this effect runs only once when the component is rendered
  React.useEffect(() => {
    window.CommandBar.addCallback('updateLeadStatus', (args: any, context: any) => {
      const companyId = context.activeLead.id;
      const newStageId = args.stageId.id;
      editCompanyDetails(companyId, 'stageId', newStageId);
    });
  }, []);
};

export default useCommandBar;
