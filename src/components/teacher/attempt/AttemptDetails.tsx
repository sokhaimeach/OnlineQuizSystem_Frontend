import { StatusBadge } from "@/components/StatusBadge"
import type { StudentAttemptsDetails } from "@/models/student.interface"
import {
  formatDateTime,
  formatDuration,
  formatEnum,
  getAttemptDuration,
  getAttemptPercentage,
} from "@/utils/student-format"
import { DetailSection } from "../details/DetailSection"

interface AttemptDetailsProps {
  attempt: StudentAttemptsDetails
}

export function AttemptDetails({ attempt }: AttemptDetailsProps) {
  const possibleScore = attempt.assignment.quiz.questions.reduce((total, question) => total + question.score, 0)
  const percentage = getAttemptPercentage(attempt.total_score, possibleScore)
  const passed = percentage != null && percentage >= attempt.assignment.quiz.passing_score
  const studentName = `${attempt.student.user.first_name} ${attempt.student.user.last_name}`

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DetailSection title="Attempt summary" items={[
        { label: "Student", value: studentName },
        { label: "Attempt number", value: attempt.attempt_number },
        { label: "Start time", value: formatDateTime(attempt.started_at) },
        { label: "Submit time", value: formatDateTime(attempt.submitted_at) },
        { label: "Duration", value: formatDuration(getAttemptDuration(attempt)) },
        {
          label: "Status",
          value: (
            <StatusBadge variant={attempt.status === "SUBMITTED" ? "success" : attempt.status === "TIMEOUT" ? "danger" : "warning"} dot>
              {formatEnum(attempt.status)}
            </StatusBadge>
          ),
        },
      ]} />
      <DetailSection title="Assignment information" items={[
        { label: "Assignment name", value: attempt.assignment.title },
        { label: "Class", value: attempt.assignment.class || "—" },
      ]} />
      <DetailSection title="Quiz information" items={[
        { label: "Quiz title", value: attempt.assignment.quiz.title },
        { label: "Description", value: attempt.assignment.quiz.description || "—" },
        { label: "Duration limit", value: `${attempt.assignment.quiz.duration_minutes} minutes` },
        { label: "Passing score", value: `${attempt.assignment.quiz.passing_score}%` },
      ]} />
      <DetailSection title="Score summary" items={[
        { label: "Total score", value: `${attempt.total_score} / ${possibleScore}` },
        { label: "Percentage", value: percentage == null ? "—" : `${percentage.toFixed(1)}%` },
        {
          label: "Result",
          value: (
            <StatusBadge variant={passed ? "success" : "danger"} dot>
              {passed ? "Passed" : "Failed"}
            </StatusBadge>
          ),
        },
      ]} />
    </div>
  )
}
