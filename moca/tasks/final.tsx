import { GameResult } from 'features/game-result';
import React, { useState } from 'react';

export const FinalMoca = () => {
  const [percent] = useState(Math.floor(Math.random() * 70 + 30));
  return <GameResult percent={percent} name='moca'></GameResult>;
};
