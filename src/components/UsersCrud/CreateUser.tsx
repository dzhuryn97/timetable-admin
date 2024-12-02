import { useState } from "react";
import { Navigate } from "react-router-dom";
import { graphql } from "../../gql";
import { executeQuery, GQError } from "../../hooks/useGraphQL";
import { useDispatchSuccessNotification } from "../NotificationShower";
import UserForm, { UserFormInputs } from "./Form/UserForm";

const createUserMutation = graphql(`
  mutation CreateUser(
    $name: String!
    $email: String!
    $password: String!
    $role: UserRoleEnum!
  ) {
    createUser(
      input: { name: $name, email: $email, password: $password, role: $role }
    ) {
      id
    }
  }
`);

function formInputsToMutationTransformer(form: UserFormInputs) {
  return {
    name: form.name,
    email: form.email,
    password: form.password as string,
    role: form.role,
  };
}

export default function CreateUser() {
  const successNotificationDispatcher = useDispatchSuccessNotification();
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  async function UserFormHandler(
    form: UserFormInputs,
  ): Promise<GQError | null> {
    const result = await executeQuery(
      createUserMutation,
      formInputsToMutationTransformer(form),
    );

    if (result.data.createUser) {
      successNotificationDispatcher("User created");
      setCreatedUserId(result.data.createUser.id);
      return null;
    }

    return result.errors.getError("createUser");
  }

  if (createdUserId) {
    return <Navigate to={"/user/" + createdUserId} />;
  }

  return (
    <>
      <UserForm action={"UPDATE"} submitHandler={UserFormHandler} />
    </>
  );
}
