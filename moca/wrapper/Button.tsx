import { Box, BoxProps, Typography } from '@mui/material';
import React from 'react';

export const MocaButton = ({
  sx,
  disabled,
  children,
  contained,
  fontSize,
  color,
  ...props
}: BoxProps & { disabled?: boolean; contained?: boolean }) => (
  <Box
    color='#ffffff'
    sx={{
      p: '0.8rem 1.5rem',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '0.6rem',
      background: contained ? '#6BBD88' : '#ffffff',
      color: disabled ? '#B9B9B9' : 'common.black',
      pointerEvents: disabled ? 'none' : 'unset',
      cursor: 'pointer',
      transition: 'all 0.3s ease 0s',

      ':hover': {
        borderColor: '#6BBD88',
        color: 'common.black',
      },
      ':active': {
        background: '#6BBD88',
        borderColor: '#6BBD88',
        color: '#ffffff',
        transition: 'all 0.01s ease 0s',
      },
      ...sx,
    }}
    {...props}
  >
    <Typography fontWeight={500} fontSize={fontSize ?? '0.9rem'} color={color ?? 'currentcolor'}>
      {children}
    </Typography>
  </Box>
);
