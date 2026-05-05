import { useEffect } from "react"
import { Link, Outlet, useMatches } from "react-router-dom"
import type { AuthViewConfig } from "@/modules/auth/types"
import OAuthButtons from "@/shared/components/buttons/o-auth-buttons/OAuthButtons"
import { initBreakpoints } from "@/shared/utils/breakpoint"
import useAppStore from "@/shared/stores/useAppStore"
import Logo from "@/shared/components/logo/Logo"
import './AuthLayout.scss'
import ErrorBanner from "@/shared/components/feedback/error-banner/ErrorBanner"

const hasAuthConfig = (handle: unknown) : handle is { authConfig: AuthViewConfig } => {
  return (
    typeof handle === "object" &&
    handle !== null &&
    "authConfig" in handle
  )
}

const AuthLayout = () => {

  const { isTablet } = useAppStore()

  const matches = useMatches()

  const currentMatch = matches[matches.length - 1]

  if (!hasAuthConfig(currentMatch.handle)) {
    throw new Error("AuthLayout requiere authConfig en la ruta")
  }
  
  const { authConfig } = currentMatch.handle 

  useEffect(() => {
    const cleanup = initBreakpoints()
    return cleanup
  }, [])

  return (
    <div className="auth-layout">
      <div className="auth-layout__content">
        <div className="auth-layout__left-column">
          <div className="auth-layout__left-column-content">
            <Logo />
            <div className="auth-layout__call-to-actions">
              <p className="auth-layout__cta-text">
                {authConfig.cta.text}
                {' '}
                <Link to={authConfig.cta.to} className="auth-layout__cta-text auth-layout__cta-text--link">{authConfig.cta.linkText}</Link>
              </p>
            </div>
            <OAuthButtons />
            
          </div>
        </div>

        {
          isTablet ? 
          <div className="auth-layout__line" /> 
          :
          <div className="auth-layout__line-wrapper">
            <div className="auth-layout__line" />
            <span>o</span>
            <div className="auth-layout__line" />
          </div>
        }
        <div className="auth-layout__right-column">
          <Outlet />
        </div> 
      </div>
      <ErrorBanner />
    </div>
  )
}

export default AuthLayout