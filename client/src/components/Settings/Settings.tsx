import { styled, TextField, Box, FormControlLabel, Radio, RadioGroup, Link, Typography, Stack } from '@mui/material';

import { useHistory } from 'react-router-dom';

import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { BASIC_AUTH } from '../../utils/constants';
import { ExtensionConfig } from '../../types';
import OpenInIcon from '@mui/icons-material/OpenInBrowser';

export const SettingsForm = (state: ExtensionConfig, setValue: Dispatch<SetStateAction<ExtensionConfig>>) => {
  const history = useHistory();

  const handleCreateFreeAccount = () => {
    history.push('/setupenv');
  };

  return (
    <>
      <Box marginBottom="16px">
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={state.authType}
          name="radio-buttons-group"
        >
          <FormControlLabel
            onClick={(e: any) => setValue({ ...state, authType: e.target.value, accessToken: undefined })}
            value="basic"
            control={<Radio />}
            label="Basic"
          />
          <FormControlLabel
            onClick={(e: any) =>
              setValue({ ...state, authType: e.target.value, username: undefined, password: undefined })
            }
            value="accessToken"
            control={<Radio />}
            label="Access Token"
          />
        </RadioGroup>
        <Box>
          <Stack spacing={2}>
            <Box>
              JFrog Environment URL
              <TextField
                fullWidth
                size="small"
                id="outlined-basic"
                label=""
                variant="outlined"
                value={state.url ?? ''}
                onChange={(e: any) => setValue({ ...state, url: e.target.value })}
              />
            </Box>
            {state.authType === BASIC_AUTH ? (
              <>
                <Box>
                  Username
                  <TextField
                    fullWidth
                    size="small"
                    key={'username'}
                    onChange={(e: any) => setValue({ ...state, username: e.target.value })}
                    label=""
                    defaultValue={state.username ?? ''}
                    variant="outlined"
                  />
                </Box>

                <Box>
                  Password
                  <TextField
                    key={'password'}
                    fullWidth
                    size="small"
                    onChange={(e: any) => setValue({ ...state, password: e.target.value })}
                    label=""
                    type="password"
                    variant="outlined"
                  />
                </Box>
              </>
            ) : (
              <>
                <Box>
                  Access Token
                  <TextField
                    key={'accessToken'}
                    fullWidth
                    size="small"
                    label=""
                    type="password"
                    onChange={(e: any) => setValue({ ...state, accessToken: e.target.value })}
                  />
                </Box>
              </>
            )}
          </Stack>
        </Box>

        <Box display="flex" alignItems="center" marginTop="20px">
          {"Don't have a JFrog environment?"}
          <Link
            underline="hover"
            fontWeight="700"
            fontFamily={'Open Sans'}
            onClick={handleCreateFreeAccount}
            sx={{
              marginLeft: '5px',
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Create one for FREE
            <OpenInIcon sx={{ marginLeft: '3px', fontSize: '18px' }} />
          </Link>
        </Box>
      </Box>
    </>
  );
};

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
