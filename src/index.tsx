import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Home/Dashboard";
import { TaskProvider } from "./context/TaskContext";
const Profile = lazy(() => import("./pages/Profile/Profile"));

const Fallback: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin border-4 border-t-4 border-gray-500 border-solid w-16 h-16 rounded-full"></div>
    <span className="ml-4 text-xl text-gray-700">Loading...</span>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      // {
      //   path: "createblog",
      //   element: (
      //     <PrivateRoute>
      //       <Form />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //   path: "profile",
      //   element: (
      //     <Suspense fallback={<Fallback />}>
      //       <Profile />
      //     </Suspense>
      //   ),
      // },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TaskProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </TaskProvider>
    </AuthProvider>
  </React.StrictMode>
);
