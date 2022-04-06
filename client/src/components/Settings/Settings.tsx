import { styled, TextField, Box, FormControlLabel, Radio, RadioGroup, Link, Typography, Stack } from '@mui/material';

import { useHistory } from 'react-router-dom';

import * as React from 'react';

import { BASIC_AUTH } from '../../utils/constants';
import { ExtensionConfig } from '../../types';

export const SettingsForm = (
  state: ExtensionConfig,
  setValue: React.Dispatch<React.SetStateAction<ExtensionConfig>>
) => {
  let history = useHistory();
  const handleCreateFreeAccount = () => {
    history.push('/create');
  };
  return (
    <>
      <FormWrapper>
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={state.authType}
          name="radio-buttons-group"
        >
          <FormControlLabel
            onClick={(e: any) => setValue({ ...state, authType: e.target.value })}
            value="basic"
            control={<Radio />}
            label="Basic"
          />
          <FormControlLabel
            onClick={(e: any) => setValue({ ...state, authType: e.target.value })}
            value="accessToken"
            control={<Radio />}
            label="Access Token"
          />
        </RadioGroup>
        <Box>
          <Stack spacing={2}>
            <Box>
              <Typography>
                JFrog Environment URL
                <TextField
                  fullWidth
                  size="small"
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  value={state.url}
                  onChange={(e: any) => setValue({ ...state, url: e.target.value })}
                />
              </Typography>
            </Box>
            {state.authType === BASIC_AUTH ? (
              <>
                <Box>
                  <Typography>
                    Username
                    <TextField
                      fullWidth
                      size="small"
                      key={'username'}
                      onChange={(e: any) => setValue({ ...state, username: e.target.value })}
                      label=""
                      defaultValue={state.username}
                      variant="outlined"
                    />
                  </Typography>
                </Box>

                <Box>
                  <Typography>
                    Password
                    <TextField
                      key={'password'}
                      fullWidth
                      color="secondary"
                      size="small"
                      onChange={(e: any) => setValue({ ...state, password: e.target.value })}
                      label=""
                      type="password"
                      variant="outlined"
                    />
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Typography>
                    Access Token
                    <TextField
                      key={'accessToken'}
                      fullWidth
                      size="small"
                      label=""
                      type="password"
                      defaultValue={state.accessToken}
                      onChange={(e: any) => setValue({ ...state, accessToken: e.target.value })}
                    />
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Box>

        <div>
          Don&apos;t have a JFrog environment?
          <Link
            underline="hover"
            fontWeight="700"
            fontFamily={'Open Sans'}
            onClick={handleCreateFreeAccount}
            sx={{ marginLeft: '5px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create one for FREE
          </Link>
        </div>
      </FormWrapper>
    </>
  );
};

const FormWrapper = styled(Box)`
  margin-bottom: 16px;
  & > div {
    margin-bottom: 20px;
  }
`;
const TextFieldLabel = styled(Box)`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: #556274;
  @media screen and (prefers-color-scheme: dark) {
    color: #f8fafb;
  }
`;
