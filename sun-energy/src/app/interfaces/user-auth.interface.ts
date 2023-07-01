export interface UserAuth {
  email: string;
  password: string;
}

export interface User {
  uuid: string;
  email: string;
}

export interface UserResponse {
  message: string;
  result: {
    uuid: string;
    email: string;
  };
}
