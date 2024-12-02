import { useLoaderData } from "react-router-dom";
import EditDoctor from "../../components/DoctorsCrud/EditDoctor";
import { graphql } from "../../gql";
import { GetDoctorByIdQuery } from "../../gql/graphql";
import { executeQuery } from "../../hooks/useGraphQL";

export async function getDoctor(doctorId: string) {
  const DoctorQuery = graphql(/* GraphQL */ `
    query GetDoctorById($id: ID) {
      doctor(id: $id) {
        ...EditDoctorFragment
      }
    }
  `);

  const response = await executeQuery(DoctorQuery, { id: doctorId });

  if (response.errors.count()) {
    throw new Error(response.errors.first().message);
  }

  return response.data;
}

export default function Edit() {
  const response = useLoaderData() as GetDoctorByIdQuery;

  return <EditDoctor doctor={response.doctor} />;
}
