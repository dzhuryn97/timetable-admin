import UserTable from "./UserTable";
import Pagination from "../../Pagination";
import {useState} from "react";
import {useGraphQL} from "../../../hooks/useGraphQL";
import UserListQuery from "./Query";

export default function UserList() {

    const pageSize: number = 10;
    const [currentPage, setCurrentPage] = useState(1)
    
    const {data,error} = useGraphQL(UserListQuery, 'users',{
        page: currentPage,
        pageSize: pageSize
    });

    const total = data?.users.paginatorInfo.total || 0;


    return <>
        {data && <>
            <UserTable users={data.users.data} />

            <Pagination
                total={total}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                pageSize={pageSize}
            />
        </>}
    </>
}