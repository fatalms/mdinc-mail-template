export type SubtrationData = {
  guessedNums: string[];
  currentAnswer: string;
  answerNums: string[];
  exerciseNum: number;
  text: TextType;
};

export type TextType = {
  description: string;
  task: string;
  init: number;
};
