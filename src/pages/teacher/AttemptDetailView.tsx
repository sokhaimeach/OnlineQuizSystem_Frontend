import { ArrowLeft, FileCheck2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { QueryError } from "@/components/teacher/QueryError";
import { AttemptDetails } from "@/components/teacher/attempt/AttemptDetails";
import { QuestionReview } from "@/components/teacher/attempt/QuestionReview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStudentAttemptsDetails } from "@/hooks/api/useStudent";

export function AttemptDetailView() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const attemptQuery = useGetStudentAttemptsDetails(id);

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
          title={attemptQuery.data?.assignment.title ?? "Attempt detail"}
          description={`Attempt ID: ${id}`}
          icon={FileCheck2}
        />
      </div>

      {attemptQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full" />
          ))}
        </div>
      ) : attemptQuery.isError || !attemptQuery.data ? (
        <QueryError
          message={
            attemptQuery.error instanceof Error
              ? attemptQuery.error.message
              : "Attempt details were not found."
          }
          onRetry={() => attemptQuery.refetch()}
        />
      ) : (
        <>
          <AttemptDetails attempt={attemptQuery.data} />
          <QuestionReview
            questions={attemptQuery.data.assignment.quiz.questions}
          />
        </>
      )}
    </div>
  );
}
