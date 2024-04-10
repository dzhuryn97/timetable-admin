import React, {FormEvent, useContext, useState} from "react";
import {Alert, Button, FormControl, Heading, Input} from "@chakra-ui/react";
import {Form, Navigate} from "react-router-dom";
import {graphql} from '../../gql'

import {executeQuery, grabError, useGraphQL} from "../../hooks/useGraphQL";
import {AuthContext} from '../../context/AuthContext';
import AuthUser from '../../models/AuthUser';
import {GraphQLError} from "graphql/error";

export default function Login() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');

    const authContext = useContext(AuthContext);


    const LoginQuery = graphql(/* GraphQL */ `
        query Login($email: String!, $password: String!)  {
            login(email: $email, password: $password)
        }
    `)

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        const res = await executeQuery(LoginQuery, {
            email: login,
            password: password
        });

        if (res.data) {
            const data = res.data;
            authContext.setAuthUser(() => new AuthUser(
                data.login,
                "Test Name"
            ));
            sessionStorage.setItem("authToken",data.login)
            sessionStorage.setItem("authName","Test Name")
        } else {
            const error = grabError("login",res.errors);
            setError(()=>error)
        }
    }

    console.log(authContext.authUser)
    if(authContext.authUser){
        return <Navigate to={"/"} />
    }

    return <>
        <div id="login-wrapper" style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e9ecef"
        }}>
            <div id="login-form"
                 style={{
                     backgroundColor: "white",
                     padding: "10px",
                     boxShadow: "0 0 1px rgba(0,0,0,.125),0 1px 3px rgba(0,0,0,.2)"
                 }}

            >
                <Heading as="h2" size="lg" mb="10px">Login form</Heading>
                <Form style={{
                    minWidth: "350px"
                }}>
                    { error && <Alert mb={"10px"} status='error'>{ error }</Alert> }

                    <FormControl mb="10px">
                        <Input placeholder='Login' value={login} onChange={(e) => setLogin(e.target.value)}/>
                    </FormControl>
                    <FormControl mb="10px">
                        <Input type="password" placeholder='Password' value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </FormControl>
                    <FormControl>
                        <Button type={"submit"} onClick={handleFormSubmit}>Login</Button>
                    </FormControl>
                </Form>
            </div>
        </div>
    </>
}