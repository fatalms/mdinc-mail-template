import { Box, Card, Typography } from '@mui/material';
import styled from 'styled-components';

export const TaskInfo = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 theme.spacing(3)',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '20px 0 0 20px',
});

export const TaskImplementationArea = styled(Box)(({ theme }) => ({
  width: 'max-content',
  height: '100%',
  background: theme.palette.common.white,
  border: '3px solid #7892c9',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
  borderRadius: '20px',
}));

interface DottedTypographyProps {
  dotColor?: string;
}

export const DottedTypography = styled(Typography).withConfig({
  shouldForwardProp: (prop) => !['dotColor'].includes(prop),
})<DottedTypographyProps>(({ theme, dotColor }) => ({
  position: 'relative',
  paddingLeft: '1.5rem',
  '::before': {
    content: "''",
    position: 'absolute',
    top: '50%',
    left: '0',
    transform: 'translateY(-50%)',
    background: dotColor || theme.palette.primary.main,
    width: '9px',
    height: '9px',
    borderRadius: '50%',
  },
}));

export const ListWrapper = styled(Card)(({ theme }) => ({
  backgroundColor: theme.decorations?.uniqColors.beige,
  padding: theme.spacing(4),
}));
