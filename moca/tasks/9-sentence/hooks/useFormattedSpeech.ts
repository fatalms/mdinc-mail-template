import { useCallback } from 'react';
import SpeechRecognition, {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from 'react-speech-recognition';

export const useFormattedSpeech = (options?: SpeechRecognitionOptions) => {
  const { transcript, interimTranscript, finalTranscript, ...rest } = useSpeechRecognition(options);

  const doFormat = useCallback((src: string) => {
    return src
      .toLowerCase()
      .replace(/открытое/, 'закрытое')
      .replace(/гостин[^\s]*/, 'гостинцы')
      .replace(/вете?р[^\s]*/, 'ветрено');
  }, []);

  return {
    transcript: doFormat(transcript),
    interimTranscript: doFormat(interimTranscript),
    finalTranscript: doFormat(finalTranscript),
    ...rest,
  };
};

export default SpeechRecognition;
