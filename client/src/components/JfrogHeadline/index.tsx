import { Box, styled, Typography } from '@mui/material';
import jfrogLogo from '../../assets/jfrog.png';

export const JfrogHeadline = ({ headline }: { headline: string }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', height: '30px', marginBottom: '50px' }}>
    <img src={jfrogLogo} alt="jfrog logo" width="34px" height="32px" />
    <Typography variant="h5" fontWeight="600" marginLeft="6px">
      {headline}
    </Typography>
  </Box>
);
