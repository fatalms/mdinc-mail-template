import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

export const CustomTypography = (props: TypographyProps) => (
  <Typography fontSize='1.3rem' fontWeight='500' display='flex' textAlign='center' {...props} />
);
