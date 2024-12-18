import { Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { graphql } from "../../gql";
import { useGraphQL } from "../../hooks/useGraphQL";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import DeleteDoctorButton from "../../components/DoctorsCrud/DeleteDoctor";
import LinkButton from "../../components/LinkButton";
import Pagination from "../../components/Pagination";

export default function List() {
  const pageSize: number = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const DoctorQuery = graphql(/* GraphQL */ `
    query Doctors($page: Int! = 1, $pageSize: Int! = 10) {
      doctors: paginationDoctors(first: $pageSize, page: $page) {
        data {
          id
          name
          description
        }
        paginatorInfo {
          total
        }
      }
    }
  `);

  const { data, error } = useGraphQL(DoctorQuery, "doctors", {
    page: currentPage,
    pageSize: pageSize,
  });

  const DoctorList = data?.doctors.data.map(function (doctor) {
    return (
      <Tr>
        <Td>{doctor.name}</Td>
        <Td>
          <LinkButton to={"/doctor/" + doctor.id}>Edit</LinkButton>
        </Td>
        <Td>
          <LinkButton
            colorScheme={"yellow"}
            to={"/doctor/" + doctor.id + "/day-slots"}
          >
            Schedule
          </LinkButton>
        </Td>
        <Td>
          <DeleteDoctorButton id={doctor.id} />
        </Td>
      </Tr>
    );
  });

  const total = data?.doctors.paginatorInfo.total || 0;

  return (
    <>
      <NavLink to={"/doctor/create"}>
        <Button>Create doctor</Button>
      </NavLink>

      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
          <Tr>
            <Th>Edit</Th>
            <Th>Schedule</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>{DoctorList}</Tbody>
      </Table>

      <Pagination
        total={total}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </>
  );
}
