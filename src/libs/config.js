require('dotenv').config();

const getEnvVariable = (name)=> {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable '${name}' is required but not set.`);
  }
  return value;
};

 const ENV = {
  host: getEnvVariable('POSTGRES_HOST'),
  username: getEnvVariable('POSTGRES_USER'),
  password: getEnvVariable('POSTGRES_PASSWORD'),
  database: getEnvVariable('POSTGRES_DB'),
  port: Number(getEnvVariable('POSTGRES_PORT')) || 5432,
  api_port: Number(getEnvVariable('PORT')) || 5000,
};
module.exports = {
  ENV
};
