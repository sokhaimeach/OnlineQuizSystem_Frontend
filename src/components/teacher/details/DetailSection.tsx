import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface DetailItem {
  label: string
  value: ReactNode
}

interface DetailSectionProps {
  title: string
  items: DetailItem[]
  children?: ReactNode
}

export function DetailSection({ title, items, children }: DetailSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {items.map(item => (
            <div key={item.label} className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</dt>
              <dd className="mt-1 break-words text-sm text-foreground">{item.value ?? "—"}</dd>
            </div>
          ))}
        </dl>
        {children}
      </CardContent>
    </Card>
  )
}
