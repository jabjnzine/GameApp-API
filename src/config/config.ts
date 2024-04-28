require('dotenv').config();

export const ConfigApp = {
  appMode: process.env.APP_MODE || 'development',
  appPort: process.env.APP_PORT || 5000,
  appVersion: '1.0.0',
  baseUrl: process.env.APP_BASE_URL || 'http://localhost:5000',
  itemPerPage: 20,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || '',
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || '',
  aws_region: process.env.AWS_REGION || '',
  aws_s3_bucket_name: process.env.AWS_S3_BUCKET_NAME || '',
  aws_s3_url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
};
