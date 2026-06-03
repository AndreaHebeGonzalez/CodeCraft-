import OAuthButtons from "@/shared/components/buttons/o-auth-buttons/OAuthButtons"
import Logo from "@/shared/components/logo/Logo"
import useAppStore from "@/shared/stores/useAppStore"

import { Link } from "react-router-dom"

type AuthFormLayoutProps = {
  children: React.ReactNode
  ctaText: string,
  ctaLinkText: string,
  ctaTo: string
}

export const AuthFormLayout = ({ children, ctaText, ctaLinkText, ctaTo } : AuthFormLayoutProps) => {

  const { isTablet } = useAppStore()

  return (
    <div className="auth-view">
      <div className="auth-view__content">
        <div className="auth-view__left-column">
          <div className="auth-view__left-column-content">
            <Logo />
            <div className="auth-view__call-to-actions">
              <p className="auth-view__text">
                {ctaText}
                {' '}
                <Link to={ctaTo} className="auth-view__text auth-view__text--accent">{ctaLinkText}</Link>
              </p>
            </div>
            <OAuthButtons />
          </div>
        </div>
        {
          isTablet ? 
          <div className="auth-view__line" /> 
          :
          <div className="auth-view__line-wrapper">
            <div className="auth-view__line" />
            <span>o</span>
            <div className="auth-view__line" />
          </div>
        }
        <div className="auth-view__right-column">
          {
            children
          }
        </div> 
      </div>
    </div>
  )
}
