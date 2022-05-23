export type CirclesCoords = {
  x: number;
  y: number;
};

export type CircleValue = {
  selected: boolean;
} & CirclesCoords;

export type LineCoords = {
  firstCircle: CirclesCoords;
  secondCircle: CirclesCoords;
};

export type Circle = {
  coords: CirclesCoords;
  value: string;
};

export type LinesState = {
  lines: LineCoords[];
  circles: CirclesCoords[];
  valueArray: string[];
  userAnswer: string[];
  level: number;
};
