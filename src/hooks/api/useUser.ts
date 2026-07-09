import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  changeUserImage,
  getStudentAccount,
  getTeacherAccount,
  updateUserAndStudentAccount,
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

export const useStudentAccount = () => {
  return useQuery({
    queryKey: ["student-account"],
    queryFn: async () => {
      const response = await getStudentAccount()
      return response.data
    },
  })
}

export const useUpdateStudentAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUserAndStudentAccount,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["student-account"] }),
  })
}

export const useUpdateUserAndTeacherAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserAndTeacherAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teacher-account"] })
      void queryClient.invalidateQueries({ queryKey: ["student-account"] })
    },
  })
}

export const useChangeUserImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changeUserImage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teacher-account"] })
      void queryClient.invalidateQueries({ queryKey: ["student-account"] })
    },
  })
}
