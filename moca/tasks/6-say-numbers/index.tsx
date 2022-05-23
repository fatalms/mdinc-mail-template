import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Order } from './order';

export type NumberVariant = 'direct' | 'revert';

export const SayNumbers = observer(() => {
  const [variant, setVariant] = useState<NumberVariant>('direct');
  const nextTask = useNextTaskDelay();

  return (
    <Order
      variant={variant}
      nextStage={(delay = 750) => {
        if (variant === 'direct') {
          setTimeout(() => {
            setVariant('revert');
          }, delay);
        } else {
          nextTask(delay);
        }
      }}
    />
  );
});
