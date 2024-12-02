import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotificationShower, {
  NotificationProvider,
} from "./components/NotificationShower";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import { UserRoleEnum } from "./gql/graphql";
import AuthToken from "./models/AuthToken";
import Login from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import Create from "./pages/Doctor/Create";
import DaySlotsEditing, { loadData } from "./pages/Doctor/DaySlotsEditing";
import Edit, { getDoctor } from "./pages/Doctor/Edit";
import List from "./pages/Doctor/List";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import UserCreate from "./pages/User/Create";
import EditUser, { GetUser } from "./pages/User/Edit";
import UserList from "./pages/User/List";

const router = createBrowserRouter([
  {
    path: "",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "doctor",
            children: [
              {
                index: true,
                element: <List />,
              },
              {
                path: "create",
                element: <Create />,
              },
              {
                path: ":id",
                element: <Edit />,
                loader: async ({ params }) => {
                  const doctorId: string = params["id"] ?? "";
                  try {
                    return await getDoctor(doctorId);
                  } catch (err) {
                    throw new Error("Error load data ");
                  }
                },
              },
              {
                path: ":id/day-slots",
                element: <DaySlotsEditing />,
                loader: async ({ params }) => {
                  const doctorId: string = params["id"] ?? "";

                  const response = await loadData(doctorId);

                  if (response.errors.count()) {
                    const error = response.errors.first();
                    throw new Error(error.message);
                  }

                  return response.data;
                },
              },
            ],
          },
          {
            path: "user",
            children: [
              {
                index: true,
                element: <UserList />,
              },
              {
                path: "create",
                element: <UserCreate />,
              },
              {
                path: ":id",
                element: <EditUser />,
                loader: async ({ params }) => {
                  const id: string = params["id"] ?? "";
                  return await GetUser(id);
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

const queryClient = new QueryClient();

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const authName = sessionStorage.getItem("authName");

    if (token && authName) {
      const authUser = new AuthToken(token, authName, UserRoleEnum.Admin);
      setAuthUser(authUser);
    }

    setInitialized(true);
  }, []);

  const [authUser, setAuthUser] = useState<AuthToken | null>(null);

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            authUser: authUser,
            setAuthUser: setAuthUser,
          }}
        >
          <NotificationProvider>
            {initialized && (
              <>
                <RouterProvider router={router} />
                <NotificationShower />
              </>
            )}
          </NotificationProvider>
        </AuthContext.Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
