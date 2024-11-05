type LoginSuccessInfo = {
  token: string;
};

type LoginPreload = {
  loginSuccess: () => void;
  login: () => void;
};
