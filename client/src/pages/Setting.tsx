import {
  styled,
  TextField,
  Stack,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { ExtensionConfig } from '../types';
import { useNavigate } from 'react-router-dom';
import { Load, Save } from '../utils/config';
import { testJFrogPlatformConnection } from '../api/config';
import { ACCESS_TOKEN, BASIC_AUTH } from '../utils/constants';
import { Policy } from '../types/policy';
import { LoadingButton } from '@mui/lab';
import { JfrogHeadline } from '../components/JfrogHeadline';
import { CredentialsForm } from '../components/CredentialsForm/CredentialsForm';
import { ddToast, ddClient, getVersions, Versions } from '../api/utils';
import UndoIcon from '@mui/icons-material/Undo';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InfoIcon from '@mui/icons-material/Info';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import xrayIcon from '../assets/xray.png';
import artifactoryIcon from '../assets/artifactory.png';
import cliIcon from '../assets/cli.png';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [extensionConfig, setExtensionConfig] = useState<ExtensionConfig>({ authType: BASIC_AUTH });
  const [oldExtensionConfig, setOldExtensionConfig] = useState<ExtensionConfig | undefined>(undefined);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isEditConnectionDetails, setIsEditConnectionDetails] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [policy, setPolicy] = useState<Policy>(Policy.Vulnerabilities);
  const [oldPolicy, setOldPolicy] = useState<Policy>(Policy.Vulnerabilities);
  const [versions, setVersions] = useState<Versions>({});

  const fetchData = useCallback(async () => {
    const config: ExtensionConfig = await Load();
    setExtensionConfig(config);
    setOldExtensionConfig(config);
    if (config.project != undefined) {
      setPolicy(Policy.Project);
      setOldPolicy(Policy.Project);
    }
    if (config.watches != undefined) {
      setPolicy(Policy.Watches);
      setOldPolicy(Policy.Watches);
    }
    try {
      const versions = await getVersions();
      setVersions(versions);
    } catch (e) {
      ddToast.error('Could not connect to JFrog Environment: ' + e);
    }
    const versions = await getVersions();
    setVersions(versions);
  }, []);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  const HandleCancel = () => {
    navigate('/scan');
  };

  const HandleSave = async () => {
    setButtonLoading(true);
    if (policy === Policy.Vulnerabilities || policy === Policy.Project) {
      extensionConfig.watches = undefined;
    }
    if (policy === Policy.Vulnerabilities || policy === Policy.Watches) {
      extensionConfig.project = undefined;
    }
    if (isEditConnectionDetails) {
      if (extensionConfig.authType === ACCESS_TOKEN) {
        extensionConfig.username = undefined;
        extensionConfig.password = undefined;
      } else {
        extensionConfig.accessToken = undefined;
      }
    } else {
      extensionConfig.password = undefined;
      extensionConfig.accessToken = undefined;
    }

    if (await Save(extensionConfig)) {
      navigate('/scan');
    } else {
      setButtonLoading(false);
    }
  };

  const HandleTestConnection = async () => {
    try {
      setIsTestingConnection(true);
      let res = await testJFrogPlatformConnection(isEditConnectionDetails ? extensionConfig : undefined);
      if (res.trim() == 'OK') {
        ddToast.success('Succesfully conntected to JFrog Environment');
      } else {
        ddToast.error('Could not connect to JFrog Environment: ' + res);
      }
      setIsTestingConnection(false);
    } catch (e) {
      ddToast.error('Could not connect to JFrog Environment: ' + e);
      setIsTestingConnection(false);
    }
  };

  const ShowJfrogDetails = () => {
    const settingsLine = (key: string, value: string | undefined, icon: string, link?: string, cloudIcon?: boolean) => {
      return (
        <Box display="flex" alignItems="center">
          <img height="15px" width="13px" src={icon} alt="" />
          <Typography width="120px" marginLeft="10px" marginRight="20px">
            {key}
          </Typography>
          {value ? (
            <Button
              variant="text"
              sx={{ width: 'fit-content', minWidth: '0', height: '20px' }}
              endIcon={versions.xrayVersion && cloudIcon ? <CloudDoneIcon color="success" /> : undefined}
              onClick={link ? () => ddClient?.host?.openExternal(link) : undefined}
            >
              {value}
            </Button>
          ) : (
            <CircularProgress size="14px" color="success" />
          )}
        </Box>
      );
    };
    return (
      <Stack spacing={2}>
        {settingsLine(
          'Environment URL:',
          oldExtensionConfig?.url?.endsWith('/') ? oldExtensionConfig?.url.slice(0, -1) : oldExtensionConfig?.url,
          artifactoryIcon,
          oldExtensionConfig?.url,
          true
        )}
        {settingsLine(
          'Xray Version:',
          versions.xrayVersion,
          xrayIcon,
          'https://www.jfrog.com/confluence/display/JFROG/Xray+Release+Notes#XrayReleaseNotes-Xray' +
            versions.xrayVersion
        )}
        {settingsLine(
          'CLI Version:',
          versions.jfrogCliVersion,
          cliIcon,
          'https://github.com/jfrog/jfrog-cli/releases/tag/v' + versions.jfrogCliVersion
        )}
      </Stack>
    );
  };
  const isMissingConnectionDetails = () => {
    if (!extensionConfig.url) {
      return true;
    }
    if (extensionConfig.authType === BASIC_AUTH && (!extensionConfig.username || !extensionConfig.password)) {
      return true;
    }
    if (extensionConfig.authType === ACCESS_TOKEN && !extensionConfig.accessToken) {
      return true;
    }
    return false;
  };

  const isSamePolicyDetails = () => {
    if (policy == Policy.Vulnerabilities && oldPolicy != Policy.Vulnerabilities) {
      // Policy changed to all Vulnerabilities
      return false;
    }
    if (policy == Policy.Project && extensionConfig.project && oldExtensionConfig?.project != extensionConfig.project) {
      // Same policy, different data
      return false;
    }
    if (policy == Policy.Watches && extensionConfig.watches && oldExtensionConfig?.watches != extensionConfig.watches) {
      // Same policy, different data
      return false;
    }
    return true;
  };

  const isSaveButtonDisabled = () => {
    if (isEditConnectionDetails) {
      return isMissingConnectionDetails(); // On edit mode , but not all details filled
    } else {
      return isSamePolicyDetails(); // Not edit mode and also policy not changed
    }
  };

  return (
    <Box justifyContent="space-between" display="flex" flexDirection="column" height="100%">
      <Box>
        <JfrogHeadline headline="JFrog Environment Settings" />
        <Box display="flex" flexDirection="row" overflow={'auto'}>
          <Stack spacing={2} minWidth="50%" paddingRight="20px" borderRight="1px solid #4b5356">
            <Typography variant="h1" fontWeight="400" fontSize="19px" id="JFrog Environment Connection Details">
              JFrog Connection Details
            </Typography>

            <Box width="370px">
              {isEditConnectionDetails
                ? CredentialsForm(extensionConfig, setExtensionConfig, navigate, isTestingConnection || isButtonLoading)
                : ShowJfrogDetails()}
            </Box>
            <Box>
              {oldExtensionConfig && (
                <Button
                  disabled={isTestingConnection || isButtonLoading}
                  color={isEditConnectionDetails ? undefined : 'success'}
                  variant={isEditConnectionDetails ? 'outlined' : 'contained'}
                  startIcon={isEditConnectionDetails ? <UndoIcon /> : <ManageAccountsIcon />}
                  onClick={() => setIsEditConnectionDetails(!isEditConnectionDetails)}
                  sx={{ width: 'fit-content', marginRight: '20px' }}
                >
                  {isEditConnectionDetails ? 'Back' : 'Edit Connection Details'}
                </Button>
              )}
              {isEditConnectionDetails && (
                <LoadingButton
                  color="success"
                  disabled={isMissingConnectionDetails() || isButtonLoading}
                  loading={isTestingConnection}
                  variant="contained"
                  sx={{ width: 'fit-content' }}
                  onClick={HandleTestConnection}
                  startIcon={<CloudQueueIcon />}
                >
                  Test Connection
                </LoadingButton>
              )}
            </Box>
          </Stack>

          <Box marginLeft="40px">
            <Box display="flex" alignItems="center">
              <Typography variant="h1" fontWeight="400" fontSize="19px" id="JFrog Environment Connection Details">
                Scanning Policy
              </Typography>
              <Tooltip
                placement="bottom"
                arrow
                title="Optionally use the Watches/Project fields to allow the security and license compliance information displayed on the scan results, to reflect the security policies required by your organization."
              >
                <InfoIcon sx={{ opacity: 0.5, marginLeft: '5px' }} />
              </Tooltip>
            </Box>

            <RadioGroup
              sx={{ marginLeft: '10px', marginTop: '10px' }}
              aria-labelledby="demo-radio-buttons-group-label"
              value={policy}
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="allVulnerabilities"
                onChange={() => setPolicy(Policy.Vulnerabilities)}
                control={<Radio />}
                label="All Vulnerabilities"
              />
              <FormControlLabel
                value="project"
                onChange={() => setPolicy(Policy.Project)}
                control={<Radio />}
                label="JFrog Project"
              />
              <Box ml={4}>
                {policy == Policy.Project && (
                  <TextField
                    placeholder="Project Name"
                    defaultValue={extensionConfig.project}
                    onChange={(e: any) => setExtensionConfig({ ...extensionConfig, project: e.target.value })}
                    size="small"
                    id="project"
                  />
                )}
              </Box>
              <FormControlLabel
                value="watches"
                onChange={() => setPolicy(Policy.Watches)}
                control={<Radio />}
                label="Watches"
              />
              <Box ml={4}>
                {policy == Policy.Watches && (
                  <TextField
                    placeholder="watch1,watch2,..."
                    defaultValue={extensionConfig.watches}
                    onChange={(e: any) => setExtensionConfig({ ...extensionConfig, watches: e.target.value })}
                    size="small"
                    id="watches"
                  />
                )}
              </Box>
            </RadioGroup>
          </Box>
        </Box>
      </Box>
      <Footer>
        <Button variant="outlined" onClick={HandleCancel}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          disabled={isSaveButtonDisabled() || isTestingConnection}
          loading={isButtonLoading}
          onClick={HandleSave}
          variant="contained"
        >
          Save
        </LoadingButton>
      </Footer>
    </Box>
  );
};

const Footer = styled(Box)`
  padding: 20px;
  padding-bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;
