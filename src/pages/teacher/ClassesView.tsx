import { useEffect, useRef, useState } from 'react'
import { Loader2, Plus, School, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ClassCard } from '@/components/teacher/ClassCard'
import { ClassDialog } from '@/components/teacher/ClassDialog'
import { DeleteClassDialog } from '@/components/teacher/DeleteClassDialog'
import { ClassShareDialog } from '@/components/teacher/ClassShareDialog'
import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  useCreateClass,
  useDeleteClass,
  useGetAllClasses,
  useUpdateClass,
} from '@/hooks/api/useClass'
import type { Class, CreateClassPayload } from '@/models/class.interface'

export function ClassesView() {
  const navigate = useNavigate()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const nextPageRequestRef = useRef(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [classDialogOpen, setClassDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [deletingClass, setDeletingClass] = useState<Class | null>(null)
  const [sharingClass, setSharingClass] = useState<Class | null>(null)
  const [classError, setClassError] = useState('')

  const classesQuery = useGetAllClasses(debouncedSearch)
  const createClassMutation = useCreateClass()
  const updateClassMutation = useUpdateClass()
  const deleteClassMutation = useDeleteClass()

  const classes = classesQuery.data?.pages.flatMap(page => page.data) ?? []
  const totalClasses = classesQuery.data?.pages[0]?.meta.totalItems ?? 0
  const isSaving = createClassMutation.isPending || updateClassMutation.isPending
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = classesQuery

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting ||
          nextPageRequestRef.current ||
          isFetchingNextPage
        ) return

        nextPageRequestRef.current = true
        void fetchNextPage().finally(() => {
          nextPageRequestRef.current = false
        })
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const openCreateDialog = () => {
    createClassMutation.reset()
    updateClassMutation.reset()
    setEditingClass(null)
    setClassError('')
    setClassDialogOpen(true)
  }

  const openEditDialog = (classItem: Class) => {
    createClassMutation.reset()
    updateClassMutation.reset()
    setEditingClass(classItem)
    setClassError('')
    setClassDialogOpen(true)
  }

  const submitClass = (payload: CreateClassPayload) => {
    const options = {
      onSuccess: () => {
        setClassDialogOpen(false)
        setEditingClass(null)
        setClassError('')
      },
      onError: () => setClassError('The class could not be saved. Please try again.'),
    }

    if (editingClass) {
      updateClassMutation.mutate({ classId: editingClass.id, payload }, options)
    } else {
      createClassMutation.mutate(payload, options)
    }
  }

  const openDeleteDialog = (classItem: Class) => {
    deleteClassMutation.reset()
    setDeletingClass(classItem)
  }

  const confirmDelete = () => {
    if (!deletingClass) return
    deleteClassMutation.mutate(deletingClass.id, {
      onSuccess: () => setDeletingClass(null),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Classes"
        description={`${totalClasses} ${totalClasses === 1 ? 'class' : 'classes'} total`}
        icon={School}
        action={{ label: 'New Class', icon: Plus, onClick: openCreateDialog }}
      />

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search classes"
            placeholder="Search classes…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {classesQuery.isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-md" />
          ))}
        </div>
      ) : classesQuery.isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-8 text-center">
          <p className="text-sm text-destructive">The classes could not be loaded.</p>
        </div>
      ) : classes.length === 0 ? (
        <EmptyState
          icon={School}
          title="No classes found"
          description={debouncedSearch ? 'Try a different search.' : 'Create your first class to get started.'}
          action={debouncedSearch ? undefined : { label: 'Create Class', onClick: openCreateDialog }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {classes.map(classItem => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                onView={({ id }) => navigate(`/teacher/classes/${id}`)}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onShare={setSharingClass}
              />
            ))}
          </div>

          <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center" aria-live="polite">
            {classesQuery.isFetchingNextPage && (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading more classes…
              </span>
            )}
            {!classesQuery.hasNextPage && classes.length > 0 && (
              <span className="text-xs text-muted-foreground">All classes loaded</span>
            )}
          </div>
        </>
      )}

      <ClassDialog
        open={classDialogOpen}
        classItem={editingClass}
        isSubmitting={isSaving}
        error={classError}
        onOpenChange={(open) => {
          if (!isSaving) setClassDialogOpen(open)
        }}
        onSubmit={submitClass}
      />

      <DeleteClassDialog
        classItem={deletingClass}
        isDeleting={deleteClassMutation.isPending}
        error={deleteClassMutation.isError ? 'The class could not be deleted. Please try again.' : undefined}
        onOpenChange={(open) => {
          if (!open && !deleteClassMutation.isPending) setDeletingClass(null)
        }}
        onConfirm={confirmDelete}
      />
      <ClassShareDialog classItem={sharingClass} onClose={() => setSharingClass(null)} />
    </div>
  )
}
