import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-1.5"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-4" /> Back to Attempts
      </Button>

      {attemptQuery.isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-36 w-full rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <Skeleton className="h-72 w-full rounded-md" />
            <div className="grid gap-6">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-56 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-md" />
            ))}
          </div>
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
