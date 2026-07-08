import { BookOpen, GraduationCap, Loader2, Plus, RotateCcw, UserRound } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useJoinClass, useJoinedClasses } from "@/hooks/api/useStudent"

export function StudentClassesView() {
  const classes = useJoinedClasses()
  const join = useJoinClass()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [classId, setClassId] = useState("")
  const submit = () => join.mutate(classId.trim(), {
    onSuccess: () => { toast.success("Class joined successfully."); setOpen(false); setClassId("") },
    onError: () => toast.error("Could not join this class. Check the class code."),
  })
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-2xl font-bold">My Classes</h1><p className="text-muted-foreground">All the learning spaces you have joined.</p></div>
        <Button onClick={() => setOpen(true)}><Plus /> Join class</Button>
      </div>
      {classes.isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <div key={i} className="h-52 animate-pulse rounded-xl bg-muted" />)}</div>
      : classes.isError ? <div className="rounded-xl border border-destructive/30 p-8 text-center"><p>Classes could not be loaded.</p><Button className="mt-3" variant="outline" onClick={() => classes.refetch()}><RotateCcw /> Try again</Button></div>
      : !classes.data?.length ? <div className="rounded-xl border border-dashed p-12 text-center"><GraduationCap className="mx-auto size-10 text-muted-foreground" /><h2 className="mt-3 font-semibold">No classes yet</h2><p className="mt-1 text-sm text-muted-foreground">Join your first class using the code your teacher shared.</p></div>
      : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{classes.data.map(item => {
        const teacher = item.teacher?.user ? `${item.teacher.user.first_name ?? ""} ${item.teacher.user.last_name ?? ""}`.trim() : `${item.teacher?.first_name ?? ""} ${item.teacher?.last_name ?? ""}`.trim()
        const subject = typeof item.subject === "string" ? item.subject : item.subject?.name ?? item.subject?.subject_name ?? "General"
        return <Card key={item.id} className="cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md" onClick={() => navigate(`/student/classes/${item.id}`)}>
          <div className="h-2 rounded-t-xl" style={{ backgroundColor: item.color || "#4f46e5" }} />
          <CardHeader><CardTitle>{item.class_name}</CardTitle><p className="text-sm text-muted-foreground">{subject}</p></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2"><UserRound className="size-4 text-muted-foreground" />{teacher || "Class teacher"}</p>
            <div className="flex gap-4 border-t pt-3 text-muted-foreground"><span>{item.total_assignments ?? item.assignment_count ?? 0} assignments</span><span>{item.total_quizzes ?? 0} quizzes</span></div>
          </CardContent>
        </Card>
      })}</div>}
      <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Join a class</DialogTitle><DialogDescription>Paste the class ID or code shared by your teacher.</DialogDescription></DialogHeader><div className="relative"><BookOpen className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={classId} onChange={e => setClassId(e.target.value)} placeholder="Enter class code" /></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={!classId.trim() || join.isPending} onClick={submit}>{join.isPending && <Loader2 className="animate-spin" />}Join class</Button></DialogFooter></DialogContent></Dialog>
    </div>
  )
}
