import { Box } from "@chakra-ui/react";
import CreateUserButton from "../../components/UsersCrud/CreateUserButton";
import UserList from "../../components/UsersCrud/List/UserList";

export default function List() {
  return (
    <>
      <Box m={"10px"}>
        <CreateUserButton />
      </Box>
      <UserList />
    </>
  );
}
