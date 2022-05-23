import { Grid } from '@mui/material';
import styled from 'styled-components';

export const LevelWrapper = styled.div(({ theme }) => ({
  width: '2.4rem',
  height: '2.4rem',
  borderRadius: '50%',
  background: `linear-gradient(335deg, ${theme.palette.primary.main} 9%,#9ab4ec 92%)`,
  textAlign: 'center',
}));

export const TimeWrapper = styled(Grid)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  background: theme.decorations?.uniqColors.beige,
}));
