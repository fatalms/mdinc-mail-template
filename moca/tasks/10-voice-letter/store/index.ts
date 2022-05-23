import { makeAutoObservable } from 'mobx';
import { availableLetters } from './static';
import { YandexSpeechRecognition_v3 } from 'stores/core/yandexSpeech_v3';
import { Speechable } from 'stores/hooks/useLocalStoreWithSpeech';
import { Timer } from 'stores/core/timer';
import { uniq } from 'lodash';

export class VoiceLetter implements Speechable {
  speech = new YandexSpeechRecognition_v3();
  timer = new Timer({ initSeconds: 60 });

  indexOfLetter = Math.round(Math.random() * (availableLetters.length - 1));
  letter = availableLetters[this.indexOfLetter];

  readonly questionNumber = 10;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get letterRegex() {
    return new RegExp(`^${this.letter}`, 'i');
  }

  get responded() {
    const respondedWords =
      uniq(this.speech.textWords?.filter((word) => this.letterRegex.test(word))).slice(0, 18) || [];

    return [...respondedWords, ...Array(18 - respondedWords.length).fill('')];
  }

  get finish() {
    return this.timer.finished || !this.responded.includes('');
  }
}
