import { Card } from '@mui/material';
import styled from 'styled-components';

export const TextBlockQuestion = styled(Card)(({ theme }) => ({
  minHeight: '3.4rem',
  width: '100%',
  backgroundColor: theme.palette.primary.light,
  boxShadow: 'none',
  padding: `1.5rem 2rem`,
}));

export const AnswerBlock = styled(Card).withConfig({
  shouldForwardProp: (prop) => !['filled', 'open'].includes(prop),
})<{ filled?: boolean; open: boolean }>(({ theme, filled = true, open = false }) => ({
  minHeight: '3.4rem',
  height: '100%',
  background: `${
    filled ? theme.palette.primary.light : open ? 'white' : theme.decorations?.uniqColors.beige
  }`,
  border: `3px solid ${open ? theme.palette.primary.main : theme.decorations?.uniqColors.beige}`,
  padding: theme.spacing(1),

  transition: 'all 0.3s ease 0s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
