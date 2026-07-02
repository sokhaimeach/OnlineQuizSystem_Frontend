import type { ReactNode } from 'react'
import { BookOpenCheck, CheckCircle2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: ReactNode
  eyebrow: string
  title: string
  description: string
  className: string
}

const benefits = [
  'Create and organize engaging quizzes',
  'Track class progress at a glance',
  'Turn results into useful feedback',
]

export function AuthLayout({ children, eyebrow, title, description, className = "" }: AuthLayoutProps) {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col">
        <div className="absolute -left-24 top-1/3 size-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 size-72 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_38%)]" />

        <div className="relative flex items-center gap-3 text-lg font-semibold">
          <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/25">
            <BookOpenCheck className="size-5" />
          </span>
          QuizClass
        </div>

        <div className="relative my-auto max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-indigo-200">
            <Sparkles className="size-4" />
            Built for better teaching
          </div>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Teach with clarity.
            <br />
            Measure what matters.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            A calm, focused workspace for creating assessments and understanding
            how every student is learning.
          </p>
          <div className="mt-9 space-y-4">
            {benefits.map(benefit => (
              <div key={benefit} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="size-5 text-emerald-400" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          A smarter classroom starts with one good question.
        </p>
      </section>

      <section className={cn("flex min-h-svh justify-center px-5 py-10 sm:px-8", className)}>
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpenCheck className="size-5" />
            </span>
            <span className="font-semibold">QuizClass</span>
          </div>
          <p className="mb-2 text-sm font-medium text-primary">{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  )
}
