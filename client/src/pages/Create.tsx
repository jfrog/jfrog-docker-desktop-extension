import { styled, TextField, Stack, Box, FormLabel, Button, InputAdornment, IconButton, Alert } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import jfrogLogo from '../assets/jfrog.png';
import { useHistory } from 'react-router-dom';

import ArtifactoryIcon from '../assets/artifactory.png';
import PipelinesIcon from '../assets/pipelines.png';
import XrayIcon from '../assets/xray.png';
export const CreatePage = () => {
  const [state, setState] = useState('curl -fL https://getcli.jfrog.io?setup | sh');
  const [isCopied, setIsCopied] = useState(false);
  let history = useHistory();

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(state)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/* <Container fixed> */}
      <Box padding={'20px'}>
        <Title>
          <StyledLogo src={jfrogLogo} alt="logo" />
          <Box>
            <Stack
              sx={{
                fontFamily: 'Open Sans',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '30px',
                color: '#414857',
              }}
            >
              Create a FREE JFrog environment account
            </Stack>
            <div>Get started using JFrog CLI</div>
          </Box>
        </Title>

        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} marginLeft={'50px'}>
          <Box mt={7}>1. Run the following command on your terminal.</Box>
          <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2} marginLeft={'20px'}>
            <Box mr={4}>
              <TextField
                sx={{ width: '370px', height: '40px' }}
                size="small"
                id="outlined-basic"
                value={state}
                focused={isCopied}
                variant="outlined"
                color="success"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleCopyClick} edge="end" color="inherit">
                        <ContentCopy color={isCopied ? 'success' : undefined} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box ml={10}>
              <FormLabel id="demo-radio-buttons-group-label">
                JFrog CLI will be install on your machine and a new JFrog account will be created
              </FormLabel>
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Box mt={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box>2. Once the setup is completed, click on</Box>
                <Button
                  variant="outlined"
                  onClick={() => {
                    history.push('/scan');
                  }}
                >
                  Done
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Stack>
        <Box margin={'30px 50px auto'} paddingTop={'30px'} borderTop={'1px solid #ccc'}>
          <Box
            sx={{
              textAlign: 'center',
              fontSize: '20px',
              margin: '10px',
              color: '#556274',
              fontWeight: 'bold',
            }}
          >
            Whats you will gain?
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Item>
              <h2>
                <img src={ArtifactoryIcon} alt="" />
                JFrog Artifactory
              </h2>
              <p>Universal management of binaries, packages, and dependencies</p>
            </Item>
            <Item>
              <h2>
                <img src={XrayIcon} alt="" /> JFrog Pipelines
              </h2>
              <p>Check Software workflow automation with powerful CI/CD</p>
            </Item>
            <Item>
              <h2>
                <img src={PipelinesIcon} alt="" /> JFrog Xray
              </h2>
              <p>Check Security scanning to identify open source vulnerabilities and license compliance issues </p>
            </Item>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const StyledLogo = styled('img')`
  margin-top: 9px;
  margin-right: 20px;
`;

const Title = styled(Box)`
  display: flex;
  align-items: flex-start;
`;
const Item = styled(Box)`
  background: #fff;
  border-radius: 15px;
  padding: 20px 30px 15px;
  max-width: 320px;
  color: #556274;
  h2 {
    margin: 0 0 6px;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
