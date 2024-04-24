require('dotenv').config();

export const ConfigApp = {
  appMode: process.env.APP_MODE || 'development',
  appPort: process.env.APP_PORT || 5000,
  appVersion: '1.0.0',
  baseUrl: process.env.APP_BASE_URL || 'http://localhost:5000',
  itemPerPage: 20,
};
