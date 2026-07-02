import type { CreateSubjectPayload, SubjectsPage } from "@/models/subject.interface";
import {
    createSubject,
    deleteSubject,
    getAllSubjects,
    getSubjectOptions,
    updateSubject,
} from "@/services/teacher/subject.service";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";

export const useGetAllSubjects = () => {
    return useInfiniteQuery({
        queryKey: ["subjects"],
        initialPageParam: 1,

        queryFn: async ({ pageParam }) => {
            const response = await getAllSubjects({
                page: pageParam,
                limit: 5,
            });

            // The axios response interceptor unwraps the HTTP response body.
            return response as unknown as SubjectsPage;
        },

        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.meta;

            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubject,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["subjects"] });
            void queryClient.invalidateQueries({ queryKey: ["subject-options"] });
        },
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            subjectId,
            payload,
        }: {
            subjectId: string,
            payload: CreateSubjectPayload
        }) => updateSubject(subjectId, payload),

        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["subjects"] });
            void queryClient.invalidateQueries({ queryKey: ["subject-options"] });
        },
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSubject,

        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["subjects"] });
            void queryClient.invalidateQueries({ queryKey: ["subject-options"] });
        },
    });
};

export const useGetSubjectOptions = () => {
    return useQuery({
        queryKey: ["subject-options"],
        queryFn: async () => {
            const response = await getSubjectOptions()
            return response.data as {id: string, subject_name: string}[]
        }
    })
}
