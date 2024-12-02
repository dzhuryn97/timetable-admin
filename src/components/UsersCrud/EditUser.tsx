import { FragmentType, graphql, useFragment } from "../../gql";
import { EditUserFragmentFragment, UserRoleEnum } from "../../gql/graphql";
import { executeQuery, GQError } from "../../hooks/useGraphQL";
import { GetEnumByValue } from "../../support/Enum";
import { useDispatchSuccessNotification } from "../NotificationShower";
import UserForm, { UserFormInputs } from "./Form/UserForm";

type EditUserProps = {
  user: FragmentType<typeof EditUserFragment>;
};

export const EditUserFragment = graphql(`
  fragment EditUserFragment on User {
    id
    email
    name
    role
  }
`);

const UpdateUserMutation = graphql(`
  mutation UpdateUser(
    $id: ID!
    $name: String!
    $email: String!
    $password: String
    $role: UserRoleEnum!
  ) {
    updateUser(
      input: {
        id: $id
        name: $name
        email: $email
        password: $password
        role: $role
      }
    ) {
      id
    }
  }
`);

function EditUserFragmentToFormInputsTransformer(
  user: EditUserFragmentFragment,
): UserFormInputs {
  return {
    name: user.name,
    email: user.email,
    // @ts-ignore
    role: UserRoleEnum[GetEnumByValue(user.role, UserRoleEnum)],
  };
}

function formInputsToMutationTransformer(
  id: string,
  userFormInputs: UserFormInputs,
) {
  return {
    id: id,
    name: userFormInputs.name,
    email: userFormInputs.email,
    password: userFormInputs.password as string,
    role: userFormInputs.role,
  };
}

export default function EditUser(props: EditUserProps) {
  const successMessageDispatcher = useDispatchSuccessNotification();

  const user = useFragment(EditUserFragment, props.user);

  async function UserFormHandler(
    output: UserFormInputs,
  ): Promise<GQError | null> {
    const result = await executeQuery(
      UpdateUserMutation,
      formInputsToMutationTransformer(user.id, output),
    );
    if (result.data.updateUser) {
      successMessageDispatcher("User updated");
      return null;
    }

    return result.errors.getError("updateUser");
  }

  return (
    <>
      <UserForm
        action={"UPDATE"}
        submitHandler={UserFormHandler}
        defaultValues={EditUserFragmentToFormInputsTransformer(user)}
      />
    </>
  );
}
