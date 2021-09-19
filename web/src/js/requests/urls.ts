
interface urlsType {
  [k: string]: Function
}

const urls: urlsType = {
  authUrl: function () {
    return "/api/auth/login";
  },
  refreshUrl: function () {
    return "/api/auth/refresh";
  },
  signInUrl: function () {
    return "/api/auth/signin";
  },
  signInConfirmationUrl: function () {
    return "/api/auth/signin/confirm";
  },
  emailExistsUrl: function (val: string) {
    return `/api/users/email/${val}`;
  },
  usernameExistsUrl: function (val: string) {
    return `/api/users/username/${val}`;
  },
};

export default urls