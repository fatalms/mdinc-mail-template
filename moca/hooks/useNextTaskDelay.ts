import { useNextTask } from 'hooks/useNextTask';
import { useCallback } from 'react';

export const useNextTaskDelay = (delay = 750) => {
  const nextTask = useNextTask();

  const nextWithDelay = useCallback(
    (customDelay?: number) => {
      setTimeout(() => {
        nextTask();
      }, customDelay ?? delay);
    },
    [nextTask]
  );

  return nextWithDelay;
};
