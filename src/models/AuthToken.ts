import {UserRoleEnum} from "../gql/graphql";

class AuthToken {
    token: string
    name: string
    role: UserRoleEnum;

    constructor(token: string, name: string, role: UserRoleEnum) {
        this.token = token;
        this.name = name;
        this.role = role;
    }

}
export default AuthToken;