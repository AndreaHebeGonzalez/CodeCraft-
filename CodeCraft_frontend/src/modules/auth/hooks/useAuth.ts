import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services";
import type { User } from "@/modules/users/types";
import type { AppError } from "@/shared/error/AppError";



const useAuth = () => {
  const { data, error,  isError, isLoading } = useQuery<
    User,
    AppError
  >({
    queryKey: ['user'],
    queryFn: getUser,
    retry: 1,
    refetchOnWindowFocus: false
  })

  return {
    data,
    error,
    isError,
    isLoading
  }
}

export default useAuth