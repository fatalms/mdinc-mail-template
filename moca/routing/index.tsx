import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PAGE_404_PATH } from 'script/app/routing/routes.config';
import { FinalMoca } from '../tasks/final';
import MocaComponents, { routesLength } from './routes.config';

export const MOCA_ROUTE = '/moca/*';

export const MocaRoute = () => {
  return (
    <Routes>
      <Route path=':taskId' element={<MocaComponents />} />
      <Route path='final' element={<FinalMoca />} />
      {/* TODO:: need to research :) */}
      {/* this hack with Navigate absolute way needed cause i can`t redirect by another way*/}
      <Route path={String(routesLength + 1)} element={<Navigate to='/moca/final' replace />} />
      <Route path='/' element={<Navigate to='1' replace />} />
      <Route path='*' element={<Navigate to={PAGE_404_PATH} replace />} />
    </Routes>
  );
};
