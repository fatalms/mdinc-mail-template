import { Card } from '@mui/material';
import { Box } from '@mui/system';
import styled from 'styled-components';

export const TaskInfo = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `0  ${theme.spacing(3)}`,
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(160deg, ${theme.palette.common.white} -13%, ${theme.decorations?.uniqColors.beige} 115%)`,
  borderRadius: `20px 0 0 20px`,
}));

export const TaskImplementationArea = styled(Box)(({ theme }) => ({
  width: 'max-content',
  height: '100%',
  background: theme.palette.common.white,
  border: `3px solid ${theme.palette.primary.main} `,
  borderRadius: '0 20px 20px 0',
}));
