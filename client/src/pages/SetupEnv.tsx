import { styled, Box, Button, Link, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ddClient } from '../api/utils';
import { JfrogHeadline } from '../components/JfrogHeadline';

const FREE_TRIAL_LINK : string = "https://jfrog.com/start-free/";

export const SetupEnvPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <JfrogHeadline headline="Create a FREE TRIAL JFrog Environment" />
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} margin={'50px'}>
        <Box>You can set up a FREE TRIAL JFrog Environment.</Box>
        <Box>
          {'We invite you to '}
          <Link
            underline="hover"
            fontWeight="700"
            fontSize="16px"
            onClick={() => ddClient?.host?.openExternal(FREE_TRIAL_LINK)}
            sx={{
              textDecoration: 'underline',
            }}
          >
            sign up here
          </Link>
          {' to create your environment.'}
        </Box>
        <Box> Upon Completion, you will be able to sign in with your new environment and credentials </Box>
          <Box width={1} marginTop="50px" display="flex" position="relative">
            <video width={'100%'} muted autoPlay loop style={{ objectFit: 'cover', transform: 'scaleX(-1)' }}>
              <source src={'https://media.jfrog.com/wp-content/uploads/2021/12/29120758/drop-1.mp4'} type="video/mp4" />
            </video>
            <Box
              width={1}
              position="absolute"
              top="50%"
              left="45px"
              sx={{ transform: 'translateY(-50%)' }}
              alignItems="center"
              fontSize="25px"
              fontWeight="600"
              zIndex="1000"
            >
            </Box>
          </Box>
      </Stack>
      <DoneButton>
        <Button type="submit" onClick={() => navigate(-1)} variant="outlined">
          Back
        </Button>
      </DoneButton>
    </>
  );
};

const DoneButton = styled(Box)`
  position: absolute;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  bottom: 0;
  right: 0;
`;
