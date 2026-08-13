import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Loading } from "./shared/components/loading/Loading";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import Login from "./modules/auth/views/Login";
import Register from "./modules/auth/views/Register";
import ConfirmAccount from "./modules/auth/views/ConfirmAccount";
import RequestNewCode from "./modules/auth/views/RequestNewCode";
import ForgotPassword from "./modules/auth/views/ForgotPassword";
import NewPassword from "./modules/auth/views/NewPassword";
import Invitation from "./modules/invitations/views/Invitation";

/* ========= LAYOUT ========= */
const AppLayout = lazy(() =>
  import("./layouts/AppLayout/AppLayout")
);

/* ========= VISTAS PRINCIPALES ========= */
const DashboardView = lazy(() =>
  import("./modules/dashboard/view/dashboard-view/DashboardView")
);

const MyProjects = lazy(() =>
  import("./modules/projects/views/my-projects/MyProjects")
);

const ErrorPage = lazy(() =>
  import("./shared/components/errors/error-page/ErrorPage")
);

/* ========= PROJECT DETAILS ========= */
const ProjectDetails = lazy(() =>
  import("./modules/projects/views/project-details/ProjectDetails")
);

const ProjectSummary = lazy(() =>
  import("./modules/projects/views/project-details/project-summary/ProjectSummary")
);

const ProjectTask = lazy(() =>
  import("./modules/projects/views/project-details/project-tasks/ProjectTask")
);

const ProjectCalendar = lazy(() =>
  import("./modules/projects/views/project-details/project-calendar/ProjectCalendar")
);

/* ========= ROUTER ========= */
export const router = createBrowserRouter([

  /* ========= APP (PROTEGIDA) ========= */

  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <DashboardView />
          </Suspense>
        )
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<Loading />}>
            <MyProjects />
          </Suspense>
        )
      },
      {
        path: "projects/:projectId",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectDetails />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="summary" replace />
          },
          {
            path: "summary",
            element: (
              <Suspense fallback={<Loading />}>
                <ProjectSummary />
              </Suspense>
            )
          },
          {
            path: "tasks",
            element: (
              <Suspense>
                <ProjectTask />
              </Suspense>
            )
          },
          {
            path: "calendar",
            element: (
              <Suspense fallback={<Loading />}>
                <ProjectCalendar />
              </Suspense>
            )
          }
        ]
      }
    ]
  },
    /* ========= Invitation ========= */

  {
    path: '/invite/:token',
    element: <Invitation />
  },

  /* ========= AUTH ========= */

  {
    id:"auth",
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        id:"login",
        path: 'login',
        element: <Login />,
      },
      {
        id:"register",
        path: 'register',
        element: <Register />,
      },
      {
        path: 'confirm-account',
        element: <ConfirmAccount /> 
      },
      {
        path:'request-code',
        element: <RequestNewCode />
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />
      },
      {
        path: 'new-password',
        element: <NewPassword />
      }
    ]
  },





  /* ========= 404 ========= */
  
  {
    path: "/404",
    element: (
      <Suspense fallback={<Loading />}>
        <ErrorPage type="not-found"/>
      </Suspense>
    )
  },


  {
    path: "*",
    element: <Navigate to="/404" replace />
  }

]);
