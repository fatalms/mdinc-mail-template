import { TaskContextComponent } from 'features/moca/controls/task-context/styled';
import styled from 'styled-components';

export const PhotoContainer = styled(TaskContextComponent)({
  position: 'relative',
  border: 'none',
  aspectRatio: '1',
  background: '#ffffff',
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'absolute',
  },
});
