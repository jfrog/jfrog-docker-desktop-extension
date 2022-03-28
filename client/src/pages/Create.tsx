import { styled, TextField, Stack, Box,  Button, InputAdornment, IconButton } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';


import { JfrogHeadline } from '../components/JfrogHeadline';
import { LINUX_SETUP, WINDOWS_SETUP } from '../utils/constants';
import { isWindows } from '../api/utils';
export const CreatePage = () => {
  const [copyText, setCopyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  let history = useHistory();
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(copyText)
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

  useEffect(() => {
    if (copyText === '') {
      isWindows().then((iswindows) => {
        if (iswindows) {
          setCopyText(WINDOWS_SETUP);
        } else {
          setCopyText(LINUX_SETUP);
        }
      });
    }
  });

  return (
    <>
      <Box>
        <Title>
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
              <JfrogHeadline headline="Create a FREE JFrog Environment" />

              <Box
                sx={{
                  fontSize: '18px',
                  color: '#556274',
                  marginLeft: '41px',
                  marginTop: '14px',
                }}
              >
              </Box>
            </Stack>
          </Box>
        </Title>

        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} marginLeft={'50px'}>
          <Box mt={7}>
            <Stack spacing={0}>
              <Box>You can set up a FREE JFrog environment in the cloud.</Box>
              <Box> Docker Desktop will automatically connect to your environment after set up is complete.</Box>
              <Box>To set up the environment, all you need to do is run the following command from your terminal.</Box>
            </Stack>
          </Box>
          <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
            <Box mt={4}>
              <TextField
                sx={{ width: '712px', height: '40px' }}
                size="small"
                id="outlined-basic"
                value={copyText}
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
          </Stack>
        </Stack>
      </Box>
      <DoneButton>
        <Button
          type="submit"
          onClick={() => {
            history.push('/scan');
          }}
          variant="contained"
        >
          Done
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
