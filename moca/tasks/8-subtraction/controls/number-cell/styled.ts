import { Box } from '@mui/material';
import styled from 'styled-components';

interface NumberCellProps {
  active: boolean;
}

export const NumberCell = styled(Box)<NumberCellProps>(({ theme, active }) => ({
  transition: 'all 0.3s ease 0s',
  backgroundColor: theme.decorations?.uniqColors.beige,
  borderRadius: '0.5rem',
  border: active ? `#aaaaaa 3px solid` : `${theme.decorations?.uniqColors.beige} 3px solid`,
}));
