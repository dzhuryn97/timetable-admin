import CreateUser from "../../components/UsersCrud/CreateUser";
import EditUser from "../../components/UsersCrud/EditUser";
import {useLoaderData, useParams} from "react-router-dom";
import {graphql} from "../../gql";
import {executeQuery} from "../../hooks/useGraphQL";
import {GetUserQuery} from "../../gql/graphql";

type CreateUserParams  = {
    id: string
}


const getUserQuery = graphql(`
    query GetUser($id: ID!) {
        user(id: $id){
            ...EditUserFragment
        }
    }
`)

export async function GetUser(id: string) {
    const response = await executeQuery(getUserQuery, {
        id: id
    })

    if(response.errors.count()){
        alert('errors');
        return ;
    }

    return response.data;
}




export default function Create(){

    const loadedData = useLoaderData() as GetUserQuery;
    const params = useParams() as CreateUserParams;
    const user = loadedData.user;

    return <>
        <EditUser user={user} />
    </>
}