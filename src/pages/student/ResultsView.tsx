import { ArrowRight, Trophy } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useJoinedClasses } from "@/hooks/api/useStudent"

export function StudentResultsView() {
  const classes = useJoinedClasses()
  const navigate = useNavigate()
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Results</h1><p className="text-muted-foreground">Open a class to review your quiz and assignment results.</p></div>
    {!classes.data?.length ? <div className="rounded-xl border border-dashed p-12 text-center"><Trophy className="mx-auto size-10 text-muted-foreground" /><h2 className="mt-3 font-semibold">No results yet</h2><p className="text-sm text-muted-foreground">Your submitted work will be available from your classes.</p></div>
    : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{classes.data.map(item => <Card key={item.id}><CardHeader><CardTitle>{item.class_name}</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">View all attempts and released results for this class.</p><Button className="w-full" variant="outline" onClick={() => navigate(`/student/classes/${item.id}`)}>View attempts <ArrowRight /></Button></CardContent></Card>)}</div>}
  </div>
}
