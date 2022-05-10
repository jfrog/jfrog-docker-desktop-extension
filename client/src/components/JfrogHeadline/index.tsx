import { Box, styled, Typography } from '@mui/material';
import jfrogLogo from '../../assets/jfrog.png';

interface Props {
  headline: string;
  marginBottom?: string;
}

export const JfrogHeadline = (props: Props) => (
  <Box display="flex" flexDirection="row" height="30px" marginBottom={props.marginBottom}>
    <img src={jfrogLogo} alt="jfrog logo" width="34px" height="32px" />
    <Typography variant="h1" fontSize="24px" fontWeight="600" marginLeft="10px">
      {props.headline}
    </Typography>
  </Box>
);
