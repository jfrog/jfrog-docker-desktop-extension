import jfrogLogo from '../../assets/jfrog_logo.png';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { Box } from '@mui/material';

const Loader = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <BouncingJfrog src={jfrogLogo} alt="" />
    </Box>
  );
};

const heartbeat = keyframes`
from {
  transform: scale3d(1, 1, 1);
}

50% {
  transform: scale3d(1.15, 1.15, 1.15);
}

to {
  transform: scale3d(1, 1, 1);
}
`;

const BouncingJfrog = styled('img')`
  width: 60px;
  animation: ${heartbeat} 1.7s infinite;
`;

export default Loader;
