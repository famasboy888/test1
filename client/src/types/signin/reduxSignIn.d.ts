export interface ISignInFormData {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  __v: number;
}

export interface UserState {
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  user: UserState;
}
