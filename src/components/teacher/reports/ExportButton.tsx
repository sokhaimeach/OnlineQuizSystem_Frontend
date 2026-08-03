import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReportExportUrl } from "@/services/teacher/reports.service";

export interface ExportOptions {
  type: "students" | "subjects" | "subject" | "class" | "overview";
  id?: string;
}

interface ExportButtonProps {
  label?: string;
  options: ExportOptions;
  disabled?: boolean;
  className?: string;
}

export function ExportButton({
  label = "Export CSV",
  options,
  disabled,
  className,
}: ExportButtonProps) {
  const download = () => {
    const url = getReportExportUrl(options.type, options.id);
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={download}
      className={`gap-2 ${className ?? ""}`}
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
