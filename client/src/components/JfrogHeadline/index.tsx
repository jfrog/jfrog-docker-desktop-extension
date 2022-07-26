import { Box, Link, Typography } from '@mui/material';
import jfrogLogo from '../../assets/jfrog.png';
import { ddClient } from '../../api/utils';

interface Props {
  headline: string;
  marginBottom?: string;
}

export const JfrogHeadline = (props: Props) => (
  <Box marginBottom={props.marginBottom}>
    <Box display="flex">
      <img src={jfrogLogo} alt="jfrog logo" width="34px" height="32px" />
      <Typography variant="h1" fontSize="24px" marginLeft="10px">
        {props.headline}
      </Typography>
    </Box>
    <Box display="flex" marginTop="5px">
      <Typography sx={{ opacity: '0.6' }}>
        {
          'Shift left and run a deep recursive scan for security vulnerabilities through all the layers of a Docker Image.'
        }
      </Typography>
      <Link
        onClick={() => ddClient?.host?.openExternal('https://jfrog.com/integration/xray-docker-security-scanning/')}
        sx={{ marginLeft: '5px' }}
      >
        Learn more
      </Link>
    </Box>
  </Box>
);
