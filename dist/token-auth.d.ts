export interface ITokenData {
  iat: number;
  exp: number;
  roles: [];
  username: string;
}

export interface IToken {
  token: string;
  refresh_token: string;
}

export interface ITokenConfig {
  url: {
    login: string;
    refresh: string;
  };
  path: {
    login: string;
    logout: string;
  };
}
