type LoginSuccessInfo = {
  token: string;
};

type LoginPreload = {
  loginSuccess: (data: LoginSuccessInfo) => void;
};
