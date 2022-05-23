import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MocaStore } from './index';

const MocaStoreContext = createContext<MocaStore | undefined>(undefined);
MocaStoreContext.displayName = ' MocaStoreContext';

export const useMocaStore = () => {
  const context = useContext(MocaStoreContext);
  if (context === undefined) {
    throw new Error('useMocaStore must be used within MocaStoreProvider');
  }
  return context;
};

export const MocaStoreProvider = ({ children }: { children: ReactNode }) => {
  const { taskId } = useParams();
  const store = useMemo(() => new MocaStore(), []);

  useEffect(() => {
    store.init();
  }, []);

  return <MocaStoreContext.Provider value={store}>{children}</MocaStoreContext.Provider>;
};
