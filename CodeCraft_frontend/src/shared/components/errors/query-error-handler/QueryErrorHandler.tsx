import type { AppError } from "@/shared/error/AppError"
import { Navigate } from "react-router-dom"
import ErrorState from "../error-state/ErrorState"

type QueryErrorHandlerProps = {
  error:  AppError
}
const QueryErrorHandler = ({ error } :  QueryErrorHandlerProps) => {

  if (error.kind === "auth") {
    return <Navigate 
      to="/auth/login"
      state={{
        title: "Tu sesión expiró. Inicia sesión nuevamente."
      }}
      />
  } 

    if(error.kind === "http" && error.status === 404) {
      return <ErrorState type="not-found" />
    }

    // 🔹 NETWORK
    if (error.kind === "network") {
      return <ErrorState type="network" />
    }

    if (error.kind === "http" && error.status === 500) {
      return <ErrorState type="server-error" />
    }

    // 🔴 FALLBACK , parsing, 
    return <ErrorState type="unknown" />
}

export default QueryErrorHandler