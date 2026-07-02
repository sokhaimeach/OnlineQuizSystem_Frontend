import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QueryErrorProps {
  message: string
  onRetry?: () => void
}

export function QueryError({ message, onRetry }: QueryErrorProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <div>
        <p className="font-medium">Unable to load this data</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  )
}
