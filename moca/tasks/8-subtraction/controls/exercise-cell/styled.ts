import { Box } from '@mui/material';
import styled from 'styled-components';

interface GuessCellProps {
  active: boolean;
}

export const GuessCell = styled(Box).withConfig({
  shouldForwardProp: (prop) => !['isGuessed'].includes(prop),
})<GuessCellProps>(({ theme, active }) => ({
  transition: 'all 0.3s ease 0s',
  border: active
    ? `${theme.palette.primary.main} 3px solid`
    : `${theme.palette.primary.main} 3px dashed`,
  backgroundColor: active ? theme.palette.primary.light : '',
  borderRadius: '0.5rem',
  width: '8rem',
  display: 'flex',
  justifyContent: 'center',
}));
