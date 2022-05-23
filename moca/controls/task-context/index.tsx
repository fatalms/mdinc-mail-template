import { Stack, StackProps } from '@mui/material';
import React from 'react';

export const TaskContext = ({ sx, ...props }: StackProps) => (
  <Stack
    padding='1.5rem 3rem'
    borderRadius='0.8rem'
    border='3px solid #E0E0E0'
    boxShadow='0px 7px 20px rgba(0, 0, 0, 0.05)'
    display='flex'
    justifyContent='center'
    alignItems='center'
    sx={{ ...sx, transition: 'all 0.3s ease 0s' }}
    bgcolor='#fff'
    {...props}
  />
);
