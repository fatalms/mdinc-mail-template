import { Paper } from '@mui/material';
import styled from 'styled-components';

interface WordCellProps {
  next?: boolean;
  filled?: boolean;
}

export const WordCell = styled(Paper).withConfig({
  shouldForwardProp: (prop) => !['filled', 'next'].includes(prop),
})<WordCellProps>(({ theme, filled }) => {
  return {
    backgroundColor: filled ? '#E6EDF4' : theme.decorations?.uniqColors.beige,
    border: filled ? `${theme.palette.primary.main} 4px solid` : '',
    padding: theme.spacing(2),
    boxShadow: 'none',
    textAlign: 'center',
    minWidth: '12.8rem',
    height: '3.2rem',
  };
});
