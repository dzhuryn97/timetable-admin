import {createContext, Dispatch, SetStateAction} from "react";
import AuthToken from "../models/AuthToken";

interface AuthContextProps {
    authUser: AuthToken | null
    setAuthUser: Dispatch<SetStateAction<AuthToken | null>>
}

export const AuthContext = createContext<AuthContextProps>({
    authUser: null,
    setAuthUser: (prevState: SetStateAction<AuthToken | null>) => prevState
});
