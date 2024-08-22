import {Box, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import UserList from "../../components/UsersCrud/List/UserList";
import CreateUserButton from "../../components/UsersCrud/CreateUserButton";

export default function List() {
    return <>
        <Box m={'10px'}>
            <CreateUserButton />
        </Box>
        <UserList />
    </>
}