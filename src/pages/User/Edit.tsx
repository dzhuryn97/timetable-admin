import { useLoaderData, useParams } from "react-router-dom";
import EditUser from "../../components/UsersCrud/EditUser";
import { graphql } from "../../gql";
import { GetUserQuery } from "../../gql/graphql";
import { executeQuery } from "../../hooks/useGraphQL";

type CreateUserParams = {
  id: string;
};

const getUserQuery = graphql(`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...EditUserFragment
    }
  }
`);

export async function GetUser(id: string) {
  const response = await executeQuery(getUserQuery, {
    id: id,
  });

  if (response.errors.count()) {
    alert("errors");
    return;
  }

  return response.data;
}

export default function Create() {
  const loadedData = useLoaderData() as GetUserQuery;
  const params = useParams() as CreateUserParams;
  const user = loadedData.user;

  return (
    <>
      <EditUser user={user} />
    </>
  );
}
