import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  changeUserImage,
  getTeacherAccount,
  updateUserAndTeacherAccount,
} from "@/services/user.service"

export const useUser = () => {
  return useQuery({
    queryKey: ["teacher-account"],
    queryFn: async () => {
      const response = await getTeacherAccount()
      return response.data
    },
  })
}

export const useUpdateUserAndTeacherAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserAndTeacherAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teacher-account"] })
    },
  })
}

export const useChangeUserImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changeUserImage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teacher-account"] })
    },
  })
}
