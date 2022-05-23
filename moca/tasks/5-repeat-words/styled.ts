import { Card } from '@mui/material';
import styled from 'styled-components';

export const WordCard = styled(Card)<{ open?: boolean }>(({ open, theme }) => ({
  width: '100%',
  padding: 0,
  [theme.breakpoints.down('xl')]: {
    minHeight: '4rem',
  },
  [theme.breakpoints.up('xl')]: {
    minHeight: '4.6rem',
  },
  backgroundColor: open ? '#EEF7FF' : theme.decorations?.uniqColors.beige,
  border: open
    ? ` 5px solid ${theme.palette.primary.main} `
    : `5px solid ${theme.decorations?.uniqColors.beige}`,
  transition: '0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
