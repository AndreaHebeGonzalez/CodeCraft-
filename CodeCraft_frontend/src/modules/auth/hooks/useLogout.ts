import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"



const useLogout = () => {

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const logout = () => {
    console.log('Se cerró sesión')
    localStorage.removeItem('AUTH_TOKEN')
    queryClient.clear()
    navigate('/auth/login')
  }

  return ({ 
    logout
  })
}

export default useLogout