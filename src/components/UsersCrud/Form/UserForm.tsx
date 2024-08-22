import {Button, FormControl, FormErrorMessage, FormLabel, Input, Select} from "@chakra-ui/react";
import React, {useState} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {GQError, GQValidationError} from "../../../hooks/useGraphQL";
import {UserRoleEnum} from "../../../gql/graphql";
import {utilGQErrorsSetter, utilRemoveOmittedFields} from "../../../support/Form";

export type UserFormInputs = {
    name: string,
    email: string,
    password?: string
    role: UserRoleEnum
};


type FormAction = 'CREATE' | 'UPDATE';

type UserFormProps = {
    action: FormAction,
    submitHandler: (form: UserFormInputs) => Promise<GQError | null>
    defaultValues?: UserFormInputs
};

export default function UserForm(props: UserFormProps) {

    const {
        register,
        setError,
        handleSubmit,
        formState: {errors},
    } = useForm<UserFormInputs>({
        defaultValues: props.defaultValues
    })

    const onSubmit: SubmitHandler<UserFormInputs> =async (data) => {
        data = utilRemoveOmittedFields(data);

        const errors = await props.submitHandler(data);

        if(!errors){
            return;
        }

        if(errors instanceof GQValidationError){
            utilGQErrorsSetter(errors, setError)
            return;
        }
        alert('Other error')
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>

            <FormControl mb="10px" isInvalid={!!errors.name}>
                <Input  {...register("name", {
                    required: 'Name is required'
                })} placeholder={"Name"} />
                {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>

            <FormControl mb="10px" isInvalid={!!errors.email}>
                <Input type={"email"}  {...register("email", {
                    required: 'Email is required',
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Entered value does not match email format",
                    },
                })}  placeholder={'Email'} />
                {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
            </FormControl>

            <FormControl mb="10px" isInvalid={!!errors.password}>
                <Input type={"password"}  {...register("password", {
                  required: props.action === 'CREATE' ? 'Password is required': false
                })}  placeholder={'Password'} />
                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
            </FormControl>

            <FormControl mb="10px" isInvalid={!!errors.role}>
                <Select {...register('role')}>
                    <option value={''}>Role</option>
                    <option value={UserRoleEnum.Admin}>Admin</option>
                    <option value={UserRoleEnum.Coordinator}>Coordinator</option>
                </Select>
            </FormControl>

            <Button type={'submit'} colorScheme={'green'}>Save</Button>
        </form>

    </>
}