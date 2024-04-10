import {createContext, Dispatch, SetStateAction} from "react";
import AuthUser from "../models/AuthUser";

interface AuthContextProps {
    authUser: AuthUser | null
    setAuthUser: Dispatch<SetStateAction<AuthUser | null>>
}

export const AuthContext = createContext<AuthContextProps>({
    authUser: null,
    setAuthUser: (prevState: SetStateAction<AuthUser | null>) => prevState
});
