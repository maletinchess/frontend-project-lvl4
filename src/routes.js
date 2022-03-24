// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  loginPath: () => [host, prefix, 'login'].join('/'),
  usersPath: () => [host, prefix, 'data'].join('/'),
  signupPath: () => [host, prefix, 'signup'].join('/'),
};
