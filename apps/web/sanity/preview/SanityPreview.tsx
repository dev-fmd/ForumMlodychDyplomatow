import { draftMode } from "next/headers";
import { PreviewToast } from "@/sanity/preview/PreviewToast";
import { VisualEditing } from "next-sanity/visual-editing";

export async function SanityPreview() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) return null;

  return (
    <>
      <PreviewToast />
      <VisualEditing />
    </>
  );
}
