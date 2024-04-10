import {Form, Navigate} from "react-router-dom";
import {Alert, Button, FormControl, Input, Textarea} from "@chakra-ui/react";
import React, {FormEvent, useState} from "react";
import {executeQuery, uploadFileViaMutation} from "../../hooks/useGraphQL";
import {graphql} from "../../gql";
import {NotificationType, Notification, useNotificationsDispatch} from "../../components/NotificationShower";

export default function Create(){

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | undefined>();
    const [error, setError] = useState('');
    const [created, setCreated] = useState(false)
    const dispatch = useNotificationsDispatch();


    const createDoctorMutation = graphql(`
        mutation createDoctor($name: String!, $description: String!, $photo: String!){
            createDoctor(input: {
                name:  $name,
                description: $description,
                photo: $photo
            }) {
                id
            }
        }
    `)

    async function handleFormSubmit(e: FormEvent) {

        if(!name){
            setError('Fill name');
            return;
        }
        if(!description){
            setError('Fill description');
            return;
        }
        if(!file){
            setError('Add photo');
            return;
        }

        let uploadedFile: string;
        try {
            uploadedFile = await uploadFileViaMutation(file);
        } catch (e) {
            setError('Upload file error');
            return;
        }

        try {
            const createdDoctor = executeQuery(createDoctorMutation,{
                name: name,
                description: description,
                photo: uploadedFile
            })

            dispatch({
                type: 'add',
                messageType:NotificationType.SUCCESS,
                message: 'Doctor created'
            })
            setCreated(true)
        } catch (e) {
            setError('Create doctor error');
        }

    }
    
    function handleImageOnChange(e: React.FormEvent<HTMLElement>) {
        const target = e.target as HTMLInputElement & {
            files: FileList
        }

        setFile(target.files[0]);
    }

    if(created){
        return <Navigate to={'/doctor'}/>
    }

    return <>
        <Form onSubmit={handleFormSubmit}>

            {error && <Alert status={'error'} mb={'5px'}>{error} </Alert>}

            <FormControl mb="10px">
                <Input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </FormControl>

            <FormControl mb="10px">
                <Textarea placeholder='Description' onChange={(e) => setDescription(e.target.value)}>{description}</Textarea>
            </FormControl>

            <FormControl mb="10px">
                <input type='file' onChange={handleImageOnChange}/>
            </FormControl>

            <FormControl>
                <Button type={"submit"} >Create</Button>
            </FormControl>

        </Form>
    </>
}