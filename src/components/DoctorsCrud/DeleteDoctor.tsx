import {graphql} from "../../gql";
import {executeQuery} from "../../hooks/useGraphQL";
import {Notification, NotificationType, useNotificationsDispatch} from "../NotificationShower";
import DeleteButton from "../DeleteButton";
import {useQuery, useQueryClient} from "@tanstack/react-query";

const DoctorDeleteMutation = graphql(/* GraphQL */`
    mutation DoctorDelete($id: ID!){
        deleteDoctor(id: $id){
            id
        }
    }
`)

export default function     DeleteDoctorButton({id}: {
    id: string
}) {
    const queryClient = useQueryClient();


    const notificationDispatch = useNotificationsDispatch();

    async function deleteDoctor(id: string): Promise<void>{
        const result = await executeQuery(DoctorDeleteMutation, {
            id: id
        })



        if (result.errors.hasError('deleteDoctor')) {
            throw new Error('Deleting doctor error');
        }
    }


    async function handleDoctorDeleting(id: string) {
        try {
            await deleteDoctor(id)
            notificationDispatch({
                type: 'add',
                messageType: NotificationType.SUCCESS,
                message: 'Doctor removed',
            })
            queryClient.invalidateQueries()
        } catch (e) {
            notificationDispatch({
                type: 'add',
                messageType: NotificationType.ERROR,
                message: 'Removing error'
            })
        }
    }

    return <DeleteButton onDelete={()=>{
        handleDoctorDeleting(id)
    }} title={'Remove doctor?'}/>;
}