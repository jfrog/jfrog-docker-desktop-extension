import { styled, Box, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import jfrogLogo from '../assets/jfrog_logo.png';
import box from '../assets/box.png';
import { isConfigured, Save } from '../utils/config';
import Loader from '../components/Loader';
import { ExtensionConfig } from '../types';
import { BASIC_AUTH } from '../utils/constants';
import { SettingsForm } from '../components/Settings/Settings';
import { LoadingButton } from '@mui/lab';
import {createDockerDesktopClient} from "@docker/extension-api-client";

export const LoginPage = () => {
  const [state, setState] = useState<ExtensionConfig>({ authType: BASIC_AUTH });
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const ddClient = createDockerDesktopClient();
  let history = useHistory();

  const HandleConnect = async () => {
    setButtonLoading(true);
    if (await Save(state)) {
      history.push('/scan');
      ddClient.desktopUI.toast.success("You're all set!");
    }
    setButtonLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      isConfigured()
        .then((configured) => {
          if (configured) {
            history.push('/scan');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <LogoWrapper>
              <StyledLogo src={jfrogLogo} alt="jfrog_logo" />
            </LogoWrapper>
            <LoginWrapper>
              <Title>
                <img src={box} alt="box" />
                <Box>
                  <Typography fontSize="34px" fontWeight="600">
                    Welcome
                  </Typography>
                  <Box sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                    Enter Your JFrog Environment Connection Details
                  </Box>
                </Box>
              </Title>

              <Box sx={{ minHeight: '500px' }}>
                {SettingsForm(state, setState)}

                <LoadingButton
                  sx={{ width: '100%' }}
                  loading={isButtonLoading}
                  type="submit"
                  variant="contained"
                  onClick={HandleConnect}
                >
                  Connect
                </LoadingButton>
              </Box>
            </LoginWrapper>
          </>
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #c9d0e3;
  height: 370px;
  @media screen and (prefers-color-scheme: dark) {
    border-right: 1px solid #4b5356;
  }
`;

const StyledLogo = styled('img')`
  width: 100px;
  margin: 0 120px;
`;

const LoginWrapper = styled(Box)`
  margin-left: 130px;
`;

const Title = styled(Box)`
  display: flex;
  align-items: flex-end;
  margin-bottom: 30px;
  h1 {
    font-weight: 600;
    letter-spacing: -0.02em;
  }
`;
