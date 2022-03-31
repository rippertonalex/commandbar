import React from 'react';

import { init } from 'commandbar';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import _ from './store/store';
import { editCompanyDetails } from './store/actions';

init('c6396d27');

const useCommandBar = () => {
  const snapshot = useSnapshot(_);
  const loggedInUserId = '424242';
  window.CommandBar.boot(loggedInUserId);

  const navigate = useNavigate();

  React.useEffect(() => {
    function router(url: string) {
      navigate(url);
    }

    window.CommandBar.addRouter(router);
  }, [navigate]);

  React.useEffect(() => {
    window.CommandBar.addContext('leads', snapshot.companies);
  }, [snapshot.companies]);

  React.useEffect(() => {
    window.CommandBar.addContext('stages', snapshot.stages);
  }, [snapshot.companies]);

  React.useEffect(() => {
    window.CommandBar.addContext('activeLead', snapshot.activeCompany);
  }, [snapshot.activeCompany]);

  React.useEffect(() => {
    window.CommandBar.addCallback('updateLeadStatus', (args: any, context: any) => {
      const companyId = context.activeLead.id;
      const newStageId = args.stageId.id;
      editCompanyDetails(companyId, 'stageId', newStageId);
    });
  }, []);
};

export default useCommandBar;
