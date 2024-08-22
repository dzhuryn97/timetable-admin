import {Td, Tr} from "@chakra-ui/react";
import LinkButton from "../../LinkButton";
import {graphql} from "../../../gql";
import { FragmentType, useFragment } from '../../../gql/fragment-masking'
import DeleteUserButton from "../DeleteUserButton";

export const UserFragment = graphql(`
    fragment UserListTableRow on User{
        id,
        name
    }
`)

type TableRowProps ={
    user: FragmentType<typeof UserFragment>
}
export default function TableRow(props:TableRowProps){

    const user = useFragment(UserFragment, props.user);

    return <Tr>
        <Td>{ user.name }</Td>
        <Td><Td><LinkButton to={"/user/"+user.id} >Edit</LinkButton></Td></Td>
        <Td><DeleteUserButton id={user.id} /></Td>
    </Tr>
}