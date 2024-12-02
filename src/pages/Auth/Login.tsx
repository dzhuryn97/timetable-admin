import { Alert, Button, FormControl, Heading, Input } from "@chakra-ui/react";
import { FormEvent, useContext, useState } from "react";
import { Form, Navigate } from "react-router-dom";
import { graphql } from "../../gql";

import { AuthContext } from "../../context/AuthContext";
import { executeQuery } from "../../hooks/useGraphQL";
import AuthToken from "../../models/AuthToken";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const authContext = useContext(AuthContext);

  const LoginQuery = graphql(/* GraphQL */ `
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        name
        token
        role
      }
    }
  `);

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await executeQuery(LoginQuery, {
      email: login,
      password: password,
    });

    if (res.errors.count()) {
      const error = res.errors.first();
      setError(error.message);
      return;
    }
    const data = res.data.login;

    authContext.setAuthUser(
      () => new AuthToken(data.token, data.name, data.role),
    );

    sessionStorage.setItem("authToken", data.token);
    sessionStorage.setItem("authName", data.name);
    sessionStorage.setItem("authRole", data.role);
  }

  if (authContext.authUser) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div
        id="login-wrapper"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e9ecef",
        }}
      >
        <div
          id="login-form"
          style={{
            backgroundColor: "white",
            padding: "10px",
            boxShadow: "0 0 1px rgba(0,0,0,.125),0 1px 3px rgba(0,0,0,.2)",
          }}
        >
          <Heading as="h2" size="lg" mb="10px">
            Login form
          </Heading>
          <Form
            style={{
              minWidth: "350px",
            }}
          >
            {error && (
              <Alert mb={"10px"} status="error">
                {error}
              </Alert>
            )}

            <FormControl mb="10px">
              <Input
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </FormControl>
            <FormControl mb="10px">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Button type={"submit"} onClick={handleFormSubmit}>
                Login
              </Button>
            </FormControl>
          </Form>
        </div>
      </div>
    </>
  );
}
