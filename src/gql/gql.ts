/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    mutation DoctorDelete($id: ID!){\n        deleteDoctor(id: $id){\n            id\n        }\n    }\n": types.DoctorDeleteDocument,
    "\n        query Login($email: String!, $password: String!)  {\n            login(email: $email, password: $password)\n        }\n    ": types.LoginDocument,
    "\n        mutation createDoctor($name: String!, $description: String!, $photo: String!){\n            createDoctor(input: {\n                name:  $name,\n                description: $description,\n                photo: $photo\n            }) {\n                id\n            }\n        }\n    ": types.CreateDoctorDocument,
    "\n        query Doctors($page: Int! = 1, $pageSize: Int! = 10) {\n           doctors: paginationDoctors(first: $pageSize, page: $page) {\n                data {\n                    id,\n                    name\n                },\n               paginatorInfo {\n                   total\n               }\n            }\n        }\n    ": types.DoctorsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DoctorDelete($id: ID!){\n        deleteDoctor(id: $id){\n            id\n        }\n    }\n"): typeof import('./graphql').DoctorDeleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query Login($email: String!, $password: String!)  {\n            login(email: $email, password: $password)\n        }\n    "): typeof import('./graphql').LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation createDoctor($name: String!, $description: String!, $photo: String!){\n            createDoctor(input: {\n                name:  $name,\n                description: $description,\n                photo: $photo\n            }) {\n                id\n            }\n        }\n    "): typeof import('./graphql').CreateDoctorDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query Doctors($page: Int! = 1, $pageSize: Int! = 10) {\n           doctors: paginationDoctors(first: $pageSize, page: $page) {\n                data {\n                    id,\n                    name\n                },\n               paginatorInfo {\n                   total\n               }\n            }\n        }\n    "): typeof import('./graphql').DoctorsDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
