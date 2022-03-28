import { styled, Box, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import jfrogLogo from '../assets/jfrog_logo.png';
import box from '../assets/box.png';
import { Load, Save } from '../utils/config';
import Loader from '../components/Loader';

import { ExtensionConfig } from '../types';
import { BASIC_AUTH } from '../utils/constants';
import { SettingsForm } from '../utils/Settings';
import { LoadingButton } from '@mui/lab';

export const LoginPage = () => {
  const [state, setState] = useState<ExtensionConfig>({ authType: BASIC_AUTH });
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isLoading, setLoading] = useState(true);
  let history = useHistory();

  const HandleConnect = async () => {
    setButtonLoading(true);
    if (await Save(state)) {
      history.push('/settings');
    }
    setButtonLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      Load()
        .then((config) => {
          if (config.url !== undefined && config.url !== '') {
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
      <Wrapper className="login-wrapper">
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
                  <Typography fontSize="34px" fontWeight="600" color="#414857">
                    Welcome
                  </Typography>
                  <Typography fontSize="18px" fontWeight="600" color="#556274">
                    Enter Your JFrog Connection Details
                  </Typography>
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
  border-right: 1px solid var(--light-gray);
  height: 370px;
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
