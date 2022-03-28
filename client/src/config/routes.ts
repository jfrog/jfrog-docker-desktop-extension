import {
  Home as HomeIcon,
} from '@mui/icons-material';

import { ScanPage } from '../pages/ScanPage';
import { LoginPage } from '../pages/Login';
import { CreatePage } from '../pages/Create';
import {  SettingsPage } from '../pages/Setting';

import { Route } from '../types/Route';

const routes: Array<Route> = [
  {
    key: 'router-login',
    title: 'login',
    description: 'Login page ',
    component: LoginPage,
    path: '/login',
    isEnabled: true,
    icon: HomeIcon,
    appendDivider: true,
  },
  {
    key: 'router-home',
    title: 'Xray Scan',
    description: 'Xray Scan',
    component: ScanPage,
    path: '/scan',
    isEnabled: true,
    icon: HomeIcon,
    appendDivider: true,
  },

  {
    key: 'router-create-config',
    title: 'Create New Config',
    description: 'Create New Config',
    path: '/create',
    component: CreatePage,
    isEnabled: true,
  },
  {
    key: 'router-settings',
    title: 'Edit JFrog Platform connection details',
    description: 'Edit Settings',
    path: '/settings',
    component: SettingsPage,
    isEnabled: true,
  },
];

export default routes;
