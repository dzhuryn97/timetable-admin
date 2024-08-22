import {graphql} from "../../../gql";

const UserListQuery = graphql(/* GraphQL */ `
    query UserList($page: Int! = 1, $pageSize: Int! = 10) {
        users(first: $pageSize, page: $page) {
            data {
                ...UserListTableRow
            },
            paginatorInfo {
                total
            }
        }
    }
`)

export default UserListQuery;
