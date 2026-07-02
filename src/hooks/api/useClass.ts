import type { Class } from "@/models/class.interface"
import { getRecentClasses } from "@/services/teacher/class.service"
import { useQuery } from "@tanstack/react-query"

export const useGetRecentClasses = () => {
    return useQuery({
        queryKey: ['recent-classes'],
        queryFn: async () => {
            const response = await getRecentClasses()
            return response.data as Class[]
        }
    })
}

