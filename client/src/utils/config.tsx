import { Config, getConfig, getJfrogExtensionConfig, saveConfig } from '../api/config';
import { ExtensionConfig } from '../types';
import { BASIC_AUTH, ACCESS_TOKEN } from './constants';
import { ddToast } from '../api/utils';

// Save a new JFrog platform configurations
export const Save = async (extensionConfig: ExtensionConfig | undefined): Promise<boolean> => {
  if (!extensionConfig) {
    return false;
  }
  try {
    await saveConfig(toJfrogCliConfig(extensionConfig));
    return true;
  } catch (error: any) {
    ddToast.error(error.toString());
    return false;
  }
};

// Load JFrog platform configurations
export const Load = async (): Promise<ExtensionConfig> => {
  const config = await getConfig();
  return toExtensionConfig(config);
};

export const isConfigured = async (): Promise<boolean> => {
  const config = await getJfrogExtensionConfig();
  return config.jfrogCliConfigured;
};

const toExtensionConfig = (config: Config): ExtensionConfig => {
  return {
    username: config.jfrogCliConfig.user,
    password: config.jfrogCliConfig.password,
    url: config.jfrogCliConfig.url,
    authType: !config.jfrogCliConfig.user ? ACCESS_TOKEN : BASIC_AUTH,
    accessToken: config.jfrogCliConfig.accessToken,
    project: config.jfrogExtensionConfig.project,
    watches: config.jfrogExtensionConfig.watches?.join(','),
  };
};

const toJfrogCliConfig = (user: ExtensionConfig): Config => {
  const config = new Config();
  config.jfrogCliConfig.url = user.url;
  config.jfrogCliConfig.user = user.username || undefined;
  config.jfrogCliConfig.password = user.password || undefined;
  config.jfrogCliConfig.accessToken = user.accessToken || undefined;
  config.jfrogExtensionConfig.project = user.project || undefined;
  config.jfrogExtensionConfig.watches = user.watches?.split(',') || undefined;
  return config;
};
