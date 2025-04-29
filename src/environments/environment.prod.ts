import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  // apiUrl: 'http://localhost:4200'
  //  apiUrl: 'https://indelible.itsabacus.net'
  apiUrl :'https://apiindelible.itsabacus.net'
  //  apiUrl :'http://localhost:3000'
};
