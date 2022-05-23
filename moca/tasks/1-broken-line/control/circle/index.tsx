import React from 'react';
import { theme } from 'script/app/mui';
import { Circle } from '../../types';

type CircleType = {
  handleClick: () => void;
  isSelected: boolean;
} & Circle;

const CIRCLE_RADIUS = 48.5;
const FONT_SIZE = 25;

const Text = (props: React.SVGProps<SVGTextElement>) => (
  <text
    textAnchor='middle'
    alignmentBaseline='middle'
    fill={theme.palette.common.black}
    fontFamily='Inter'
    fontWeight={500}
    {...props}
  />
);

export const CircleSVG = ({ coords, value, handleClick, isSelected }: CircleType) => (
  <svg
    viewBox='0 0 200 200'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={handleClick}
    x={coords.x - 2 * CIRCLE_RADIUS}
    y={coords.y - 2 * CIRCLE_RADIUS}
    width={200}
    height={200}
    cursor={'pointer'}
  >
    <circle
      cx={100}
      cy={100}
      r={CIRCLE_RADIUS}
      fill={isSelected ? '#F3F3F3' : '#ffffff'}
      stroke={isSelected ? '#E0E0E0' : theme.palette.primary.main}
      strokeWidth={3}
      strokeDasharray={isSelected ? '6,0' : '6,6'}
      filter='drop-shadow( 0px 7px 20px rgba(0, 0, 0, 0.05))'
      style={{ transition: 'all 0.3s ease 0s' }}
    />
    <Text x={100} y={103} fontSize={40}>
      {value}
    </Text>
    {(value === 'Д' || value === '1') && (
      <Text x={100} y={100 + CIRCLE_RADIUS + FONT_SIZE} fontSize={FONT_SIZE - 7}>
        {(value === 'Д' ? 'конец' : 'начало').toUpperCase()}
      </Text>
    )}
  </svg>
);
