import type { Class, CreateClassPayload } from "@/models/class.interface"
import {
    createClass,
    deleteClass,
    getAllClasses,
    getClassById,
    getRecentClasses,
    updateClass,
} from "@/services/teacher/class.service"
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

interface ClassesPage {
    data: Class[]
    meta: {
        totalItems: number
        totalPages: number
        currentPage: number
        limit: number
    }
}

export const useGetAllClasses = (search = "") => {
    return useInfiniteQuery({
        queryKey: ["classes", search],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const response = await getAllClasses({
                page: pageParam,
                limit: 5,
                search,
            })

            // The axios response interceptor unwraps the HTTP response body.
            return response as unknown as ClassesPage
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.meta

            return currentPage < totalPages ? currentPage + 1 : undefined
        },
    })
}

export const useCreateClass = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createClass,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["classes"] })
            void queryClient.invalidateQueries({ queryKey: ["recent-classes"] })
        },
    })
}

export const useUpdateClass = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            classId,
            payload,
        }: {
            classId: string
            payload: CreateClassPayload
        }) => updateClass(classId, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["classes"] })
            void queryClient.invalidateQueries({ queryKey: ["recent-classes"] })
        },
    })
}

export const useDeleteClass = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteClass,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["classes"] })
            void queryClient.invalidateQueries({ queryKey: ["recent-classes"] })
        },
    })
}

export const useGetRecentClasses = () => {
    return useQuery({
        queryKey: ["recent-classes"],
        queryFn: async () => {
            const response = await getRecentClasses()
            return response.data as Class[]
        },
    })
}

export const useGetClassById = (classId: string) => {
    return useQuery({
        queryKey: ["class", classId],
        queryFn: async () => {
            const response = await getClassById(classId)
            return response.data as Class
        },
        enabled: Boolean(classId),
    })
}

