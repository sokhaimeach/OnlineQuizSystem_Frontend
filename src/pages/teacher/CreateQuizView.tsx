import { useState } from 'react'
import {
  PlusCircle, Clock, FileQuestion, ChevronRight, ChevronLeft,
  Trash2, GripVertical, CheckSquare, AlignLeft, Check,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const steps = ['Details', 'Settings', 'Questions', 'Review']

const questionTypes = [
  { id: 'mcq', label: 'Multiple Choice', icon: FileQuestion, description: 'Students choose from 4 options' },
  { id: 'tf', label: 'True / False', icon: CheckSquare, description: 'Simple binary answer' },
  { id: 'short', label: 'Short Answer', icon: AlignLeft, description: 'Open-ended text response' },
]

const sampleQuestions = [
  { id: 1, text: 'What is the quadratic formula?', type: 'MCQ', points: 2 },
  { id: 2, text: 'The speed of light is 3×10⁸ m/s.', type: 'T/F', points: 1 },
  { id: 3, text: 'Explain Newton\'s second law of motion.', type: 'Short Answer', points: 5 },
]

export function CreateQuizView() {
  const [step, setStep] = useState(0)
  const [quizTitle, setQuizTitle] = useState('')
  const [quizDesc, setQuizDesc] = useState('')
  const [timeLimit, setTimeLimit] = useState('30')
  const [selectedType, setSelectedType] = useState('mcq')

  const stepProgress = ((step + 1) / steps.length) * 100

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <PageHeader
        title="Create Quiz"
        description="Build a new quiz for your students"
        icon={PlusCircle}
      />

      {/* Step Indicator */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, idx) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => idx < step + 1 && setStep(idx)}
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                    idx < step
                      ? 'bg-primary text-primary-foreground cursor-pointer'
                      : idx === step
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground cursor-default',
                  )}
                >
                  {idx < step ? <Check className="h-4 w-4" /> : idx + 1}
                </button>
                <span className={cn('text-[11px] font-medium hidden sm:block', idx === step ? 'text-primary' : idx < step ? 'text-foreground' : 'text-muted-foreground')}>
                  {s}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={cn('flex-1 h-px mx-2 mt-[-12px] sm:mt-[-24px]', idx < step ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>
        <Progress value={stepProgress} className="h-1" />
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-xl border border-border p-6">
        {/* Step 0 — Details */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Quiz Details</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Quiz Title <span className="text-destructive">*</span></label>
              <Input
                placeholder="e.g. Chapter 5: Newton's Laws"
                value={quizTitle}
                onChange={e => setQuizTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                rows={3}
                placeholder="What will students be tested on?"
                value={quizDesc}
                onChange={e => setQuizDesc(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Science</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Class</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option>Class 10-A</option>
                  <option>Class 9-B</option>
                  <option>Class 11-C</option>
                  <option>Class 8-A</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Settings */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Quiz Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={e => setTimeLimit(e.target.value)}
                  min={5}
                  max={180}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Passing Score (%)</label>
                <Input type="number" defaultValue="60" min={0} max={100} />
              </div>
            </div>
            {[
              { label: 'Shuffle Questions', desc: 'Randomize question order for each student', defaultChecked: true },
              { label: 'Shuffle Answers', desc: 'Randomize answer choices for MCQ questions', defaultChecked: true },
              { label: 'Show Results Immediately', desc: 'Students see their score right after submitting', defaultChecked: false },
              { label: 'Allow Multiple Attempts', desc: 'Students can retake the quiz', defaultChecked: false },
            ].map(opt => (
              <label key={opt.label} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked={opt.defaultChecked} className="mt-0.5 accent-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Step 2 — Questions */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Questions ({sampleQuestions.length})</h2>
              <div className="flex gap-2">
                {questionTypes.map(t => (
                  <Button
                    key={t.id}
                    size="sm"
                    variant={selectedType === t.id ? 'default' : 'outline'}
                    onClick={() => setSelectedType(t.id)}
                    className="gap-1.5 text-xs"
                  >
                    <t.icon className="h-3.5 w-3.5" />{t.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-2">
              {sampleQuestions.map((q, idx) => (
                <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors group">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{q.text}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge variant="muted" className="text-[10px]">{q.type}</StatusBadge>
                      <span className="text-[11px] text-muted-foreground">{q.points} pts</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add from Bank */}
            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-primary">
              <PlusCircle className="h-4 w-4" /> Add from Question Bank
            </button>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Review & Publish</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Title', value: quizTitle || 'Chapter 5: Newton\'s Laws' },
                { label: 'Subject', value: 'Mathematics' },
                { label: 'Class', value: 'Class 10-A' },
                { label: 'Time Limit', value: `${timeLimit} minutes` },
                { label: 'Questions', value: `${sampleQuestions.length} questions` },
                { label: 'Total Points', value: `${sampleQuestions.reduce((a, q) => a + q.points, 0)} pts` },
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-0.5 p-3 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">Save as Draft</Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90">Publish Quiz</Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="gap-1.5">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
