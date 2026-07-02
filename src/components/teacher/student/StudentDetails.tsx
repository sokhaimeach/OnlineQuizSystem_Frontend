import { StatusBadge } from "@/components/StatusBadge"
import type { StudentDetails as StudentDetailsModel } from "@/models/student.interface"
import { formatDateTime, formatEnum } from "@/utils/student-format"
import { DetailSection } from "../details/DetailSection"

interface StudentDetailsProps {
  student: StudentDetailsModel
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const fullName = `${student.user.first_name} ${student.user.last_name}`
  const status = student.user.status

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DetailSection title="Basic information" items={[
        { label: "Full name", value: fullName },
        { label: "Gender", value: formatEnum(student.user.gender) },
        { label: "Date of birth", value: formatDateTime(student.date_of_birth).split(",")[0] },
        { label: "Phone number", value: student.phone_number || "—" },
        { label: "Parent phone", value: student.parent_phone_number || "—" },
        { label: "Bio", value: student.user.bio || "—" },
      ]} />
      <DetailSection title="Account information" items={[
        { label: "Student ID", value: student.id ?? student.user_id },
        { label: "Public ID", value: student.user.public_id || "—" },
        { label: "Email", value: student.user.email },
        {
          label: "Status",
          value: (
            <StatusBadge variant={status === "ACTIVE" ? "success" : status === "SUSPENDED" ? "danger" : "muted"} dot>
              {formatEnum(status)}
            </StatusBadge>
          ),
        },
      ]} />
      <DetailSection title="Academic information" items={[
        {
          label: "Classes",
          value: student.classes.length
            ? student.classes.map(classItem => classItem.class_name).join(", ")
            : "Not assigned",
        },
        { label: "Classes enrolled", value: student.classes.length },
      ]} />
      <DetailSection title="Statistics" items={[
        { label: "Quizzes completed", value: student.stats.total_quizzes_completed },
        { label: "Average score", value: `${student.stats.average_score ?? 0}%` },
        { label: "Highest score", value: `${student.stats.highest_score ?? 0}%` },
        { label: "Lowest score", value: `${student.stats.lowest_score ?? 0}%` },
      ]} />
    </div>
  )
}
