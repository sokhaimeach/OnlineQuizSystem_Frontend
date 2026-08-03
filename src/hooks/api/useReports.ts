import { useQuery } from "@tanstack/react-query";
import {
  getAtRiskStudents,
  getClassReport,
  getDashboardImprovement,
  getImprovementReport,
  getReportsOverview,
  getStudentPerformance,
  getStudentReport,
  getSubjectAnalytics,
  getSubjectReport,
} from "@/services/teacher/reports.service";
import type { ReportQuery } from "@/models/report.interface";

export const useReportsOverview = () => {
  return useQuery({
    queryKey: ["reports", "overview"],
    queryFn: getReportsOverview,
    staleTime: 30_000,
  });
};

export const useDashboardImprovement = () => {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: getDashboardImprovement,
    staleTime: 30_000,
  });
};

export const useStudentPerformance = (query?: ReportQuery) => {
  return useQuery({
    queryKey: ["reports", "students", query],
    queryFn: () => getStudentPerformance(query),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};

export const useAtRiskStudents = (query?: ReportQuery) => {
  return useQuery({
    queryKey: ["reports", "at-risk", query],
    queryFn: () => getAtRiskStudents(query),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};

export const useStudentReport = (studentId: string) => {
  return useQuery({
    queryKey: ["reports", "student", studentId],
    queryFn: () => getStudentReport(studentId),
    enabled: Boolean(studentId),
    staleTime: 60_000,
  });
};

export const useImprovementReport = () => {
  return useQuery({
    queryKey: ["reports", "improvement"],
    queryFn: getImprovementReport,
    staleTime: 30_000,
  });
};

export const useSubjectAnalytics = (query?: ReportQuery) => {
  return useQuery({
    queryKey: ["reports", "subjects", query],
    queryFn: () => getSubjectAnalytics(query),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};

export const useSubjectReport = (subjectId: string) => {
  return useQuery({
    queryKey: ["reports", "subject", subjectId],
    queryFn: () => getSubjectReport(subjectId),
    enabled: Boolean(subjectId),
    staleTime: 60_000,
  });
};

export const useClassReport = (classId: string) => {
  return useQuery({
    queryKey: ["reports", "class", classId],
    queryFn: () => getClassReport(classId),
    enabled: Boolean(classId),
    staleTime: 60_000,
  });
};
