import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { DashboardSection } from "@/components/app-sidebar";
import type { DashboardInsightCards } from "@/models/report.interface";

interface InsightCardsProps {
  cards: DashboardInsightCards;
  onNavigate: (section: DashboardSection) => void;
  navigate: NavigateFunction;
}

export function InsightCards({ cards, onNavigate, navigate }: InsightCardsProps) {
  const highestFailure = cards.subjects_high_failure[0];
  const topImproved = cards.most_improved[0];

  const items: {
    key: string;
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    iconClass: string;
    onClick: () => void;
  }[] = [
    {
      key: "at-risk",
      label: "Students At Risk",
      value: String(cards.at_risk_count),
      sub:
        cards.critical_count > 0
          ? `${cards.critical_count} critical`
          : `${cards.needs_improvement_count} need improvement`,
      icon: AlertTriangle,
      iconClass: "text-red-600 dark:text-red-400",
      onClick: () => onNavigate("at-risk"),
    },
    {
      key: "subjects",
      label: "High-Failure Subjects",
      value: highestFailure ? highestFailure.subject_name : "0",
      sub: highestFailure
        ? `${highestFailure.fail_rate}% failing · ${highestFailure.failed_count} fails`
        : "No data yet",
      icon: TrendingDown,
      iconClass: "text-amber-600 dark:text-amber-400",
      onClick: () => onNavigate("subject-analysis"),
    },
    {
      key: "improved",
      label: "Most Improved",
      value: topImproved ? topImproved.name : "0",
      sub: topImproved
        ? `+${topImproved.delta ?? 0} pts · now ${topImproved.recent_average ?? 0}%`
        : "No improving students",
      icon: TrendingUp,
      iconClass: "text-emerald-600 dark:text-emerald-400",
      onClick: () => onNavigate("improvement"),
    },
    {
      key: "missing",
      label: "Missing Assignments",
      value: String(cards.missing_assignments_count),
      sub: "students have gaps",
      icon: ClipboardList,
      iconClass: "text-indigo-600 dark:text-indigo-400",
      onClick: () =>
        navigate("/teacher/reports/students", {
          state: { initialFilters: { has_missing: "true" } },
        }),
    },
    {
      key: "timeouts",
      label: "Multiple Timeouts",
      value: String(cards.timeouts_count),
      sub: "students timed out 2+ times",
      icon: XCircle,
      iconClass: "text-orange-600 dark:text-orange-400",
      onClick: () =>
        navigate("/teacher/reports/students", {
          state: { initialFilters: { has_timeout: "true" } },
        }),
    },
    {
      key: "inactive",
      label: "Inactive Students",
      value: String(cards.inactive_count),
      sub: "no activity recently",
      icon: Users,
      iconClass: "text-blue-600 dark:text-blue-400",
      onClick: () => onNavigate("at-risk"),
    },
    {
      key: "lowest-class",
      label: "Lowest Performing Class",
      value: cards.lowest_class?.class_name ?? "—",
      sub: cards.lowest_class
        ? `${cards.lowest_class.average_score ?? 0}% average`
        : "No class data",
      icon: ChevronDown,
      iconClass: "text-violet-600 dark:text-violet-400",
      onClick: () =>
        cards.lowest_class &&
        navigate(`/teacher/reports/class/${cards.lowest_class.class_id}`),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={item.onClick}
          className="group bg-card rounded-md border border-border p-4 text-left hover:border-primary/30 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <span className={`rounded-lg p-2 ${item.iconClass} bg-current/10`}>
              <item.icon className="h-4 w-4 text-inherit" />
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="mt-3 text-xl font-bold text-foreground leading-none truncate">
            {item.value}
          </p>
          <p className="mt-1 text-xs font-medium text-foreground">{item.label}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
            {item.sub}
          </p>
        </button>
      ))}
    </div>
  );
}
