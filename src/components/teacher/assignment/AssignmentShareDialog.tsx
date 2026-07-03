import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Check, Copy, ExternalLink, Link2 } from "lucide-react"
import type { AssignmentWithQuiz } from "@/models/assignment.interface"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export type AssignmentShareMode = "link" | "qr"

interface AssignmentShareDialogProps {
  assignment: AssignmentWithQuiz | null
  mode: AssignmentShareMode
  onClose: () => void
}

export function AssignmentShareDialog({ assignment, mode, onClose }: AssignmentShareDialogProps) {
  const [qrCode, setQrCode] = useState("")
  const [copied, setCopied] = useState(false)
  const shareUrl = assignment ? `${window.location.origin}/do-quiz/${assignment.id}` : ""

  useEffect(() => {
    setCopied(false)
    if (!shareUrl) {
      setQrCode("")
      return
    }
    void QRCode.toDataURL(shareUrl, {
      width: 256,
      margin: 2,
      color: { dark: "#111827", light: "#ffffff" },
    }).then(setQrCode)
  }, [shareUrl])

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
  }

  return (
    <Dialog open={Boolean(assignment)} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "qr" ? "Assignment QR code" : "Share assignment"}</DialogTitle>
          <DialogDescription>
            Students who open this link or scan the QR code will be sent to the quiz attempt page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="rounded-md border bg-muted/40 p-3">
            <p className="font-medium">{assignment?.title}</p>
            <p className="text-sm text-muted-foreground">{assignment?.quiz?.title}</p>
          </div>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={shareUrl} readOnly className="pl-9" aria-label="Shareable assignment link" />
            </div>
            <Button type="button" variant="outline" size="icon" onClick={() => void copyLink()} aria-label="Copy link">
              {copied ? <Check className="text-emerald-600" /> : <Copy />}
            </Button>
          </div>
          {qrCode && (
            <div className="flex justify-center rounded-md border bg-white p-4">
              <img src={qrCode} alt={`QR code for ${assignment?.title ?? "assignment"}`} className="size-56" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
          <Button type="button" onClick={() => window.open(shareUrl, "_blank", "noopener,noreferrer")}>
            <ExternalLink className="size-4" /> Open quiz page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
