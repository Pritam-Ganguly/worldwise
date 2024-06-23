import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

interface IAuthContext {
  user: { username: string; password: string };
  isAuthenticated: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
}

const initialAuthState: IAuthContext = {
  user: { username: "", password: "" },
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};

interface IAuthReducerState {
  user: { username: string; password: string };
  isAuthenticated: boolean;
}

const InitialAuthReducerState: IAuthReducerState = {
  user: { username: "", password: "" },
  isAuthenticated: false,
};

const authReducer: (
  state: IAuthReducerState,
  action: { type: string; payload?: any }
) => IAuthReducerState = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return {
        ...state,
        user: { username: "", password: "" },
        isAuthenticated: false,
      };
    default:
      throw new Error("Invalid operation");
  }
};

// bad practise.
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext<IAuthContext>(initialAuthState);

const FakeAuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    authReducer,
    InitialAuthReducerState
  );

  const login = (email: string, pass: string) => {
    if (email === FAKE_USER.email && pass === FAKE_USER.password) {
      dispatch({ type: "login", payload: { username: email, password: pass } });
    } else {
      throw new Error("Invalid user name or password");
    }
  };

  const logout = () => {
    dispatch({ type: "logout" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isAuthenticated: isAuthenticated,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Auth context is being used out of scope");
  return context;
};

export { FakeAuthContextProvider, useAuth };
