import { useQuery } from "@tanstack/react-query"
import { getTeacherAccount } from "@/services/user.service"

export const useUser = () => {
  return useQuery({
    queryKey: ["teacher-account"],
    queryFn: async () => {
      const response = await getTeacherAccount()
      return response.data
    },
  })
}
