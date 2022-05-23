import { Stack } from '@mui/material';
import { SideBar } from 'components/sidebar';
import { GameHeader } from 'features/wrapper/game-header';
import { GameContent } from 'features/wrapper/GameContent';
import { GameFooter } from 'features/wrapper/GameFooter';
import React from 'react';
import { MocaButton } from './Button';

interface WrapperProps {
  level: number;
  header: React.ReactNode;
  children: React.ReactNode;
  onNext?: () => void;
  continueBtnDisabled?: boolean;
  timeLeft?: string | number;
  serverError?: boolean;
}

const MocaPageWrapper = ({
  header,
  children,
  onNext,
  continueBtnDisabled = true,
  timeLeft,
  serverError,
}: WrapperProps) => {
  return (
    <SideBar>
      <Stack flexGrow={1} p='0 2rem 2rem 2rem' spacing='1rem' bgcolor='#F8F8F8'>
        <GameHeader variant='default' time={timeLeft} title={header} />
        <GameContent p={0} bgcolor='#F8F8F8' sx={{ boxShadow: 'none' }} dialog={!!serverError}>
          {children}
        </GameContent>
        <GameFooter justifyContent='end'>
          <MocaButton onClick={onNext} disabled={continueBtnDisabled}>
            Продолжить
          </MocaButton>
        </GameFooter>
      </Stack>
    </SideBar>
  );
};

export default MocaPageWrapper;
