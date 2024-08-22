import TableRow, {UserFragment} from "./TableRow";
import {Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {FragmentType} from "../../../gql";

type TableProps = {
    users: FragmentType<typeof UserFragment>[]
};
export default function UserTable(props: TableProps){

    const UserList = props.users.map(function (user) {
        return <TableRow user={user} />
    })

    return <Table >
        <Thead>
            <Tr>
                <Th>Name</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
            </Tr>
        </Thead>
        <Tbody>
            {UserList}
        </Tbody>
    </Table>;
}