import type React from "react"
import Logo from "@/shared/components/logo/Logo"

import './account-action-layout.scss'

type AccountActionLayoutProps = {
  children: React.ReactNode
  title: string
  text: string
  accentText: string
}
const AccountActionLayout = ({ children, title, text, accentText } : AccountActionLayoutProps) => {

  return (
    <div className="account-action-layout">
      <div className="account-action-layout__content">
        <Logo />
        <h2 className="account-action-layout__title">{title}</h2>
        <p className="account-action-layout__text">{text}{" "}
          <span 
            className="account-action-layout__text confirm-account__text--accent"
            >{accentText}
          </span>
        </p>

        {children}
      
      </div>
    </div>
  )
}

export default AccountActionLayout