import { Box, styled, Typography } from '@mui/material';
import jfrogLogo from '../../assets/jfrog.png';

interface Props {
  headline: string;
  marginBottom?: string;
}

export const JfrogHeadline = (props: Props) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', height: '30px', marginBottom: props.marginBottom }}>
    <img src={jfrogLogo} alt="jfrog logo" width="34px" height="32px" />
    <Typography variant="h5" fontWeight="600" marginLeft="10px">
      {props.headline}
    </Typography>
  </Box>
);
