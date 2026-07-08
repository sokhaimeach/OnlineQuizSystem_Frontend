import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { AuthLayout } from "@/layouts/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRegisterAsStudent } from "@/hooks/api/useAuth"
import { useJoinClass } from "@/hooks/api/useStudent"
import type { RegisterAsStudentPayload } from "@/models/auth.interface"

const initial: RegisterAsStudentPayload = { first_name: "", last_name: "", email: "", password: "", gender: "OTHER", bio: "", date_of_birth: "", phone_number: "", parent_phone_number: "", image: null }

export function StudentRegisterPage() {
  const [form, setForm] = useState(initial)
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const register = useRegisterAsStudent()
  const join = useJoinClass()
  const classId = params.get("classId")
  const set = <K extends keyof RegisterAsStudentPayload>(key: K, value: RegisterAsStudentPayload[K]) => { setForm(f => ({ ...f, [key]: value })); setError("") }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) return setError("First and last name are required.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address.")
    if (form.password.length < 8) return setError("Password must be at least 8 characters.")
    if (form.password !== confirm) return setError("Passwords do not match.")
    if (!form.date_of_birth) return setError("Date of birth is required.")
    try {
      await register.mutateAsync(form)
      if (classId) await join.mutateAsync(classId)
      toast.success(classId ? "Your account has been created and you have successfully joined the class." : "Student account created.")
      navigate("/student/account", { replace: true })
    } catch {
      setError("Registration could not be completed. Please review your details.")
    }
  }
  return <AuthLayout className="" eyebrow="Student registration" title="Start learning with QuizClass" description={classId ? "Create your account and you’ll be added to the shared class automatically." : "Create a student account to join classes and complete quizzes."}>
    <form className="space-y-5" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="First name *"><Input value={form.first_name} onChange={e => set("first_name", e.target.value)} /></Field><Field label="Last name *"><Input value={form.last_name} onChange={e => set("last_name", e.target.value)} /></Field></div>
      <Field label="Email address *"><Input type="email" autoComplete="email" value={form.email} onChange={e => set("email", e.target.value)} /></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Password *"><div className="relative"><Input className="pr-10" type={show ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShow(v => !v)}>{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></Field><Field label="Confirm password *"><Input type={show ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} /></Field></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Gender"><Select value={form.gender} onValueChange={v => set("gender", v)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MALE">Male</SelectItem><SelectItem value="FEMALE">Female</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent></Select></Field><Field label="Date of birth *"><Input type="date" value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} /></Field><Field label="Phone number"><Input value={form.phone_number} onChange={e => set("phone_number", e.target.value)} /></Field><Field label="Parent phone number"><Input value={form.parent_phone_number} onChange={e => set("parent_phone_number", e.target.value)} /></Field></div>
      <Field label="Bio"><Textarea maxLength={300} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="A little about your interests and learning goals" /></Field>
      <Field label="Profile image (optional)"><Input type="file" accept="image/*" onChange={e => set("image", e.target.files?.[0] ?? null)} /></Field>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button className="h-11 w-full" disabled={register.isPending || join.isPending}>{register.isPending || join.isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}{join.isPending ? "Joining class…" : register.isPending ? "Creating account…" : "Create student account"}</Button>
    </form>
    <p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link className="font-medium text-primary hover:underline" to={classId ? `/login?redirect=${encodeURIComponent(`/student/join/${classId}`)}` : "/login"}>Sign in</Link></p>
  </AuthLayout>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="flex flex-col gap-2 text-sm font-medium">{label}{children}</label> }
