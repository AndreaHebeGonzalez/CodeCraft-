import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

/* ========= LAYOUT ========= */
const AppLayout = lazy(() =>
  import("./layouts/AppLayout/AppLayout")
);

/* ========= VISTAS PRINCIPALES ========= */
const DashboardView = lazy(() =>
  import("./modules/dashboard/DashboardView")
);

const MyProjects = lazy(() =>
  import("./modules/projects/views/MyProjects/MyProjects")
);

const ErrorPage = lazy(() =>
  import("./shared/components/Error/ErrorPage/ErrorPage")
);

/* ========= PROJECT DETAILS ========= */
const ProjectDetails = lazy(() =>
  import("./modules/projects/views/ProjectDetails/ProjectDetails")
);

const ProjectSummary = lazy(() =>
  import("./modules/projects/views/ProjectDetails/ProjectSummary/ProjectSummary")
);

const ProjectTask = lazy(() =>
  import("./modules/projects/views/ProjectDetails/ProjectTasks/ProjectTask")
);

const ProjectCalendar = lazy(() =>
  import("./modules/projects/views/ProjectDetails/ProjectCalendar/ProjectCalendar")
);

/* ========= ROUTER ========= */
export const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Cargando dashboard...</div>}>
            <DashboardView />
          </Suspense>
        )
      },
      {
        path: "projects",
        element: (
          <Suspense fallback={<div>Cargando proyectos...</div>}>
            <MyProjects />
          </Suspense>
        )
      },
      {
        path: "projects/:projectId",
        element: (
          <Suspense fallback={<div>Cargando proyecto...</div>}>
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
              <Suspense fallback={<div>Cargando resumen...</div>}>
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
              <Suspense fallback={<div>Cargando calendario...</div>}>
                <ProjectCalendar />
              </Suspense>
            )
          }
        ]
      },
      {
        path: "404",
        element: (
          <Suspense fallback={<div>Cargando error...</div>}>
            <ErrorPage />
          </Suspense>
        )
      }
    ]
  }
]);
