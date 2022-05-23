import { useStaticAudio } from 'hooks/useAudio';
import { config } from 'src/config';

export const useMocaStaticAudio = (...props: Parameters<typeof useStaticAudio>) => {
  const { playAudio, ...rest } = useStaticAudio(...props);

  return {
    playAudio: (...urls: string[]) => {
      return playAudio(
        ...urls.map((url) => {
          console.log('url:', url);
          return url.includes('https')
            ? url
            : `${config.apiHost}/api/static-file-loader/${url}.m4a`;
        })
      );
    },
    ...rest,
  };
};
