import { config } from 'dotenv/types';
import { Config, getConfig, saveConfig } from '../api/config';
import { ExtensionConfig } from '../types';
import { BASIC_AUTH, ACCESS_TOKEN } from './constants';

// Save a new JFrog platform configurations
export const Save = async (user: ExtensionConfig | undefined): Promise<Boolean> => {
  if (!user) {
    return false;
  }
  try {
    if (!user.url) {
      alert('Please Enter Url');
      return false;
    }
    if (!user.authType || user.authType === BASIC_AUTH) {
      if (!user.username) {
        alert('Please Enter Username');
        return false;
      }
      if (!user.password) {
        alert('Please Enter Password');
        return false;
      }
    } else {
      if (!user.accessToken) {
        alert('Please Enter  Access Token');
        return false;
      }
    }

    await saveConfig(toJfrogCliConfig(user));
    return true;
  } catch (error) {
    alert('error while login:' + error);
    return false;
  }
};

// Load JFrog platform configurations
export const Load = async (): Promise<ExtensionConfig> => {
  const config = await getConfig();
  return toExtensionConfig(config);
};

const toExtensionConfig = (config: Config): ExtensionConfig => {
  return {
    username: config.jfrogCliConfig.user,
    password: config.jfrogCliConfig.password,
    url: config.jfrogCliConfig.url,
    authType: !config.jfrogCliConfig.user ? ACCESS_TOKEN : BASIC_AUTH,
    accessToken: config.jfrogCliConfig.accessToken,
    project: config.xrayScanConfig.project,
    watches: config.xrayScanConfig.watches?.join(','),
  };
};

const toJfrogCliConfig = (user: ExtensionConfig): Config => {
  const config = new Config();
  config.jfrogCliConfig.url = user.url;
  config.jfrogCliConfig.user = user.username || '';
  config.jfrogCliConfig.password = user.password || '';
  config.jfrogCliConfig.accessToken = user.accessToken || '';
  config.xrayScanConfig.project = user.project || '';
  config.xrayScanConfig.watches = user.watches?.split(',') || [];
  return config;
};
