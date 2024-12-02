import { useQueryClient } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { executeQuery } from "../../hooks/useGraphQL";
import DeleteButton from "../DeleteButton";
import {
  useDispatchErrorNotification,
  useDispatchSuccessNotification,
} from "../NotificationShower";

const UserDeleteMutation = graphql(/* GraphQL */ `
  mutation UserDelete($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`);

async function deleteUser(id: string): Promise<void> {
  const result = await executeQuery(UserDeleteMutation, {
    id: id,
  });

  if (result.errors.hasError("deleteUser")) {
    throw new Error("Deleting doctor error");
  }
}

export default function DeleteUserButton({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const successNotificationDispatcher = useDispatchSuccessNotification();
  const errorNotificationDispatcher = useDispatchErrorNotification();

  async function deleteUserHandler(id: string) {
    try {
      await deleteUser(id);
      successNotificationDispatcher("User removed");
      queryClient.invalidateQueries();
    } catch (e) {
      errorNotificationDispatcher("Removing error");
    }
  }

  return (
    <DeleteButton
      onDelete={() => {
        deleteUserHandler(id);
      }}
      title={"Remove user?"}
    />
  );
}
