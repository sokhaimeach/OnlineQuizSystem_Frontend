import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { LoginPayload } from '@/models/auth.interface'
import { useLogin } from '@/hooks/api/useAuth'

function getErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error)) return 'Unable to sign in. Please try again.'
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? 'The email or password you entered is incorrect.'
}

const Login = () => {
    const location = useLocation()
    const registered = (location.state as { registered?: boolean } | null)?.registered
    const [form, setForm] = useState<LoginPayload>({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const loginMutation = useLogin()

    const updateField = (field: keyof LoginPayload, value: string) => {
        setForm(current => ({ ...current, [field]: value }))
        setError('')
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setError('')
        try {
            await loginMutation.mutateAsync(form)
        } catch (loginError) {
            setError(getErrorMessage(loginError))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout
            eyebrow="Teacher portal"
            title="Welcome back"
            description="Sign in to manage your classes, quizzes, and student progress."
            className="items-center"
        >
            {registered && (
                <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Your teacher account is ready. You can sign in now.
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">Email address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="teacher@school.com"
                            className="h-11 pl-10"
                            value={form.email}
                            onChange={event => updateField('email', event.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium" htmlFor="password">Password</label>
                        <span className="text-xs text-muted-foreground">Use your teacher password</span>
                    </div>
                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            className="h-11 px-10"
                            value={form.password}
                            onChange={event => updateField('password', event.target.value)}
                            required
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => setShowPassword(current => !current)}
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                </div>

                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

                <Button className="h-11 w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting && <LoaderCircle className="animate-spin" />}
                    {isSubmitting ? 'Signing in…' : 'Sign in as teacher'}
                </Button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
                New to QuizClass?{' '}
                <Link className="font-medium text-primary hover:underline" to="/register">
                    Create a teacher account
                </Link>
            </p>
        </AuthLayout>
    )
}

export default Login
