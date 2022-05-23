export const allowedCoords = [
  [
    { x: 241, y: 54 },
    { x: 490, y: 56.5 },
    { x: 65, y: 147.5 },
    { x: 429, y: 201.5 },
    { x: 608, y: 192.5 },
    { x: 206, y: 242.5 },
    { x: 65.5, y: 350 },
    { x: 351, y: 346 },
    { x: 591.5, y: 423 },
    { x: 213.5, y: 462 },
  ],
];

export const allowedValues: Array<string[]> = [
  ['Д', 'А', '5', 'Б', '2', '1', 'Г', '4', '3', 'В'],
  ['В', 'Г', '3', '4', '5', 'Б', '2', '1', 'Д', 'А'],
  ['Б', 'В', '2', '3', '4', 'А', '1', '5', 'Г', 'Д'],
];

export const getRandomArr = () => allowedValues[Math.floor(Math.random() * allowedValues.length)];

export const correctAnswer = ['1', 'А', '2', 'Б', '3', 'В', '4', 'Г', '5', 'Д'];
