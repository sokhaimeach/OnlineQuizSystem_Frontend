import api from "@/lib/axios";
import type {
  AtRiskStudentsResponse,
  ClassReport,
  DashboardImprovement,
  ImprovementReport,
  PaginationMeta,
  ReportQuery,
  ReportsOverview,
  StudentPerformanceResponse,
  StudentReport,
  SubjectAnalyticsResponse,
  SubjectReport,
} from "@/models/report.interface";

const buildQuery = (query?: ReportQuery) => {
  const params: Record<string, string | number> = {};
  if (!query) return params;
  const entries = Object.entries(query);
  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === "") continue;
    params[key] = value;
  }
  return params;
};

const unwrap = <T,>(response: unknown) => response as T;

export const getReportsOverview = async () => {
  const response = await api.get<{ data: ReportsOverview }>(
    "/teacher/reports/overview",
  );
  return unwrap<ReportsOverview>((response as unknown as { data: ReportsOverview }).data);
};

export const getDashboardImprovement = async () => {
  const response = await api.get<{ data: DashboardImprovement }>(
    "/teacher/reports/dashboard",
  );
  return unwrap<DashboardImprovement>((response as unknown as { data: DashboardImprovement }).data);
};

export const getStudentPerformance = async (query?: ReportQuery) => {
  const response = await api.get("/teacher/reports/students", {
    params: buildQuery(query),
  });
  const body = response as unknown as {
    data: StudentPerformanceResponse["data"];
    meta: PaginationMeta;
  };
  return { data: body.data, meta: body.meta } as StudentPerformanceResponse;
};

export const getAtRiskStudents = async (query?: ReportQuery) => {
  const response = await api.get("/teacher/reports/students/at-risk", {
    params: buildQuery(query),
  });
  const body = response as unknown as {
    data: AtRiskStudentsResponse["data"];
    meta: PaginationMeta;
  };
  return { data: body.data, meta: body.meta } as AtRiskStudentsResponse;
};

export const getStudentReport = async (studentId: string) => {
  const response = await api.get<{ data: StudentReport }>(
    `/teacher/reports/student/${studentId}`,
  );
  return unwrap<StudentReport>((response as unknown as { data: StudentReport }).data);
};

export const getImprovementReport = async () => {
  const response = await api.get<{ data: ImprovementReport }>(
    "/teacher/reports/improvement",
  );
  return unwrap<ImprovementReport>((response as unknown as { data: ImprovementReport }).data);
};

export const getSubjectAnalytics = async (query?: ReportQuery) => {
  const response = await api.get("/teacher/reports/subjects", {
    params: buildQuery(query),
  });
  const body = response as unknown as {
    data: SubjectAnalyticsResponse["data"];
    meta: PaginationMeta;
  };
  return { data: body.data, meta: body.meta } as SubjectAnalyticsResponse;
};

export const getSubjectReport = async (subjectId: string) => {
  const response = await api.get<{ data: SubjectReport }>(
    `/teacher/reports/subject/${subjectId}`,
  );
  return unwrap<SubjectReport>((response as unknown as { data: SubjectReport }).data);
};

export const getClassReport = async (classId: string) => {
  const response = await api.get<{ data: ClassReport }>(
    `/teacher/reports/class/${classId}`,
  );
  return unwrap<ClassReport>((response as unknown as { data: ClassReport }).data);
};
