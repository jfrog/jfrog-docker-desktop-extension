import { styled, Box, Button, Link, Stack } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { setupEnv } from '../api/setup-env';
import { JfrogHeadline } from '../components/JfrogHeadline';
import { createDockerDesktopClient } from '@docker/extension-api-client';

export const enum SetupStage {
  Idle,
  WaitingForUser,
  PreparingEnv,
  Done,
  Error,
}

export const SetupEnvPage = () => {
  const history = useHistory();
  const ddClient = createDockerDesktopClient();
  const [setupStage, setSetupStage] = useState<SetupStage>(SetupStage.Idle);

  const setupEnvHandler = () => {
    setSetupStage(SetupStage.WaitingForUser);
    setupEnv(() => setSetupStage(SetupStage.PreparingEnv))
      .then(() => {
        setSetupStage(SetupStage.Done);
        ddClient.desktopUI.toast.success('Please verify your email address within the next 72 hours.');
        history.push('/scan');
      })
      .catch(() => {
        setSetupStage(SetupStage.Error);
        console.error;
      });
  };

  return (
    <>
      <JfrogHeadline headline="Create a FREE JFrog Environment" marginBottom="50px" />
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} margin={'50px'}>
        <Box>You can set up a FREE JFrog environment in the cloud.</Box>
        <Box>
          {'We invite you to '}
          <Link
            underline="hover"
            fontWeight="700"
            fontSize="18px"
            onClick={setupEnvHandler}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            sign in here
          </Link>
          {' to create your environment.'}
        </Box>
        <Box> Docker Desktop will automatically connect to your environment after the setup is complete.</Box>

        {(setupStage == SetupStage.WaitingForUser || setupStage == SetupStage.PreparingEnv) && (
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
              {setupStage == SetupStage.WaitingForUser ? 'Waiting for you to sign in...' : 'Completing the setup...'}
            </Box>
          </Box>
        )}
      </Stack>
      <DoneButton>
        <Button
          type="submit"
          onClick={() => {
            history.goBack();
          }}
          variant="outlined"
        >
          Back
        </Button>
      </DoneButton>
    </>
  );
};

const Title = styled(Box)`
  display: flex;
  align-items: flex-start;
`;

const DoneButton = styled(Box)`
  position: absolute;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  bottom: 0;
  right: 0;
`;
