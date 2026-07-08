import { useQuery } from "@tanstack/react-query";
import {
    getTeacherAnalytics,
    getDashboardSummary,
    getReportActivity,
    getReportUpcomingDeadlines,
} from "@/services/teacher/analytics.service";

export const useTeacherAnalytics = () => {
    return useQuery({
        queryKey: ["teacher-analytics"],
        queryFn: getTeacherAnalytics,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
};

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: getDashboardSummary,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
};

export const useReportActivity = () => {
    return useQuery({
        queryKey: ["report-activity"],
        queryFn: getReportActivity,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
};

export const useReportUpcomingDeadlines = () => {
    return useQuery({
        queryKey: ["report-upcoming-deadlines"],
        queryFn: getReportUpcomingDeadlines,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
    });
};
