"use client";

import { useIsPresentationTool } from "next-sanity/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { disable } from "./disable";

export function PreviewToast() {
  const isPresentationTool = useIsPresentationTool();
  const router = useRouter();
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Show toast only if draft mode is enabled
    if (isPresentationTool === false) {
      if (!toastIdRef.current) {
        toastIdRef.current = "draft-mode-toast";
        toast("Tryb roboczy włączony", {
          id: toastIdRef.current,
          description: "Treść jest na żywo, odświeżanie automatyczne",
          duration: Infinity,
          action: {
            label: "Wyłącz tryb roboczy",
            onClick: async () => {
              await disable();
              router.refresh();
            },
          },
        });
      }
    } else {
      // Dismiss the toast if not in draft mode
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    }
  }, [isPresentationTool, router]);

  return null;
}
