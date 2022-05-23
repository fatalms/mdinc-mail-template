import { Card, Paper } from '@mui/material';
import styled, { css, keyframes } from 'styled-components';

export const TaskInfo = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `0  ${theme.spacing(3)}`,
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(160deg, ${theme.palette.common.white} - 13%, ${theme.decorations?.uniqColors.beige} 115 %)`,
  borderRadius: `20px 0 0 20px`,
}));

export const TaskImplementationArea = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.palette.common.white,
  border: `3px solid ${theme.palette.primary.main} `,
  borderRadius: '0 20px 20px 0',
}));

const stroke = keyframes({
  '100%': {
    strokeDashoffset: '0',
  },
});

export const Line = styled('line')(
  ({ theme }) => ({
    stroke: theme.palette.primary.main,
    strokeDasharray: '700',
    strokeDashoffset: '700',
    strokeWidth: '3',
  }),
  css`
    animation: ${stroke} 0.3s ease forwards;
  `
);
