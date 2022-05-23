import { Stack } from '@mui/material';
import styled from 'styled-components';

export const TaskContextComponent = styled(Stack)(() => ({
  border: '3px solid #E0E0E0',
  boxShadow: '0px 7px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease 0s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '0.8rem',
}));
