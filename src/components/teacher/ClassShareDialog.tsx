import QRCode from "qrcode";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Class } from "@/models/class.interface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function ClassShareDialog({
  classItem,
  onClose,
}: {
  classItem: Class | null;
  onClose: () => void;
}) {
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const url = classItem
    ? `${window.location.origin}/student/join/${classItem.id}`
    : "";
  useEffect(() => {
    if (!url) {
      setQr("");
      return;
    }
    void QRCode.toDataURL(url, { width: 320, margin: 2 }).then(setQr);
  }, [url]);
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Class join link copied.");
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Dialog
      open={Boolean(classItem)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Invite students to {classItem?.class_name || "this class"}
          </DialogTitle>
          <DialogDescription>
            Students can open this link or scan the QR code to register and join
            automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input readOnly value={url} />
            <Button size="icon" variant="outline" onClick={copy}>
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          {qr && (
            <div className="flex justify-center rounded-xl border bg-white p-4">
              <img
                className="size-56"
                src={qr}
                alt={`Join QR code for ${classItem?.class_name}`}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink /> Open link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
