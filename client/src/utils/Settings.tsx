import { styled, TextField, Box, FormLabel, FormControlLabel, Radio, RadioGroup, Link } from '@mui/material';

import { useHistory } from 'react-router-dom';

import * as React from 'react';

import { BASIC_AUTH } from './constants';
import { ExtensionConfig } from '../types';

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
        <Box minHeight={'250px'}>
          <Box>
            <Label>
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
            </Label>
          </Box>
          {state.authType === BASIC_AUTH ? (
            <>
              <Box>
                <Label>
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
                </Label>
              </Box>

              <Box>
                <Label>
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
                </Label>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Label>
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
                </Label>
              </Box>
            </>
          )}
        </Box>

        <div>
          Don&apos;t have a JFrog environment?
          <Link
            underline="hover"
            fontWeight="700"
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

const Label = styled(FormLabel)`
  display: block;
  margin-bottom: 20px;
  font-weight: bold;
`;

const FormWrapper = styled(Box)`
  margin-bottom: 16px;
  & > div {
    margin-bottom: 20px;
  }
`;
