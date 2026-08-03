import { useCallback } from "react";
import { ArrowLeft, ClipboardList, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { QueryError } from "@/components/teacher/QueryError";
import { AttemptHistoryTable } from "@/components/teacher/attempt/AttemptHistoryTable";
import { StudentDetails } from "@/components/teacher/student/StudentDetails";
import { StudentPerformanceOverview } from "@/components/teacher/student/StudentPerformanceOverview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetStudentAttemptsHistories,
  useGetStudentById,
} from "@/hooks/api/useStudent";

export function StudentDetailView() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const studentQuery = useGetStudentById(id);
  const attemptsQuery = useGetStudentAttemptsHistories(id);
  const viewAttempt = useCallback(
    (attemptId: string) => {
      navigate(`/teacher/attempts/${attemptId}`);
    },
    [navigate],
  );
  const fullName = studentQuery.data
    ? `${studentQuery.data.user.first_name} ${studentQuery.data.user.last_name}`
    : "Student detail";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 gap-1.5"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        <PageHeader
          title={fullName}
          description={`Student ID: ${id}`}
          icon={UserRound}
        />
      </div>

      {studentQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full" />
          ))}
        </div>
      ) : studentQuery.isError || !studentQuery.data ? (
        <QueryError
          message={
            studentQuery.error instanceof Error
              ? studentQuery.error.message
              : "Student details were not found."
          }
          onRetry={() => studentQuery.refetch()}
        />
      ) : (
        <StudentDetails student={studentQuery.data} />
      )}

      <StudentPerformanceOverview studentId={id} />

      <section className="space-y-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ClipboardList className="size-5" /> Attempt history
          </h2>
          <p className="text-sm text-muted-foreground">
            Quiz submissions and scores for this student.
          </p>
        </div>
        {attemptsQuery.isError ? (
          <QueryError
            message={
              attemptsQuery.error instanceof Error
                ? attemptsQuery.error.message
                : "Attempt history could not be loaded."
            }
            onRetry={() => attemptsQuery.refetch()}
          />
        ) : (
          <AttemptHistoryTable
            attempts={attemptsQuery.data ?? []}
            loading={attemptsQuery.isLoading}
            onView={viewAttempt}
          />
        )}
      </section>
    </div>
  );
}
