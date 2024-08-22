import {useLoaderData} from "react-router-dom";
import {graphql} from "../../gql";
import {executeQuery, GQValidationError} from "../../hooks/useGraphQL";
import {GetDoctorByIdQuery, StatusEnum, UpdateDoctorMutationVariables} from "../../gql/graphql";
import {uploadFile} from "../../components/ImageUploader";
import {NotificationType, useNotificationsDispatch} from "../../components/NotificationShower";
import {DaySlotTemplateModel, DoctorModel} from "../../components/DoctorsCrud/Models";
import {DoctorForm, FormValues} from "../../components/DoctorsCrud/Form/DoctorForm";
import EditDoctor from "../../components/DoctorsCrud/EditDoctor";


export async function getDoctor(doctorId: string) {
   const DoctorQuery = graphql(/* GraphQL */ `
      query GetDoctorById($id: ID) {
         doctor(id: $id) {
            ...EditDoctorFragment
         }
      }
   `)

   const response =  await executeQuery(DoctorQuery, {id: doctorId});

   if(response.errors.count()){
      throw new Error(response.errors.first().message);
   }

   return response.data;
}


export default function Edit() {
    const response = useLoaderData() as GetDoctorByIdQuery;

    return <EditDoctor doctor={response.doctor}/>
}