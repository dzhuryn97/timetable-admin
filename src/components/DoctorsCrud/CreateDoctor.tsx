import React, {useState} from "react";
import {
    NotificationType,
    useDispatchErrorNotification,
    useDispatchSuccessNotification,
    useNotificationsDispatch
} from "../NotificationShower";
import {graphql} from "../../gql";
import {DoctorModel} from "./Models";
import {uploadFile} from "../ImageUploader";
import {executeQuery, GQValidationError} from "../../hooks/useGraphQL";
import {DoctorForm, FormValues} from "./Form/DoctorForm";
import {CreateDoctorMutationVariables} from "../../gql/graphql";
import {transformDaySlotTemplatesValuesToInput} from "./Transformer";

type CreateDoctorProps = {
    onDoctorCreated?: (doctorId: string) => void
}

const createDoctorMutation = graphql(`
    mutation createDoctor($name: String!, $description: String!, $photo: String!, $daySlotTemplates: [DaySlotTemplateInput!]!){
        createDoctor(input: {
            name:  $name,
            description: $description,
            photo: $photo,
            daySlotTemplates: $daySlotTemplates
        }) {
            id
        }
    }
`)

function transformFormValuesToInputTransformer(values: FormValues): CreateDoctorMutationVariables {
    return  {
        photo: values.photo as string,
        name: values.name,
        description: values.description,
        daySlotTemplates: values.daySlotTemplates.map((value) =>
            transformDaySlotTemplatesValuesToInput(value)
        ),

    }
}

export default function CreateDoctor(props: CreateDoctorProps) {
    const successNotificationDispatch = useDispatchSuccessNotification()
    const errorNotificationDispatch = useDispatchErrorNotification()

    async function handleSuccessSubmit(formValues: FormValues) {

        if (formValues.photo instanceof File) {
            formValues.photo = await uploadFile(formValues.photo);
        }

        const response = await executeQuery(
            createDoctorMutation,
            transformFormValuesToInputTransformer(formValues)
        )

        if (response.data.createDoctor) {
            if (props.onDoctorCreated) {
                props.onDoctorCreated(response.data.createDoctor.id);
            }
            successNotificationDispatch('Doctor created');

            return ;
        }

        const error = response.errors.getError('createDoctor');

        if (error instanceof GQValidationError) {
            return error;
        }
        errorNotificationDispatch(error.message);
    }

    return <>
        <DoctorForm action={"update"} onSuccessSubmit={handleSuccessSubmit}/>
    </>
}