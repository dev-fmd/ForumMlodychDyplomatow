import { ComponentProps, ElementType } from "react";
import { SanityImage as Image } from "sanity-image";

type SanityImageProps = {
  image?: { [key: string]: any } | null;
  preview?: boolean;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  mode?: "cover" | "contain";
  className?: string;
  as?: ElementType;
} & ComponentProps<"img">;

/**
 * Component for rendering Sanity images
 * @see https://www.sanity.io/plugins/sanity-image
 */
export function SanityImage({ image, preview, ...props }: SanityImageProps) {
  if (!image?.asset) {
    console.warn("Missing Sanity image object in SanityImage component");
    return null;
  }
  const id = image.asset?._ref ?? image.asset?._id;
  const alt = props.alt ?? image.asset?.altText ?? image.alt ?? "";

  if (preview && typeof window === "undefined") {
    throw new Error("Image preview can only be used in client components");
  }

  return (
    <Image
      id={id}
      alt={alt}
      hotspot={image.hotspot}
      crop={image.crop}
      preview={preview && image.asset?.metadata?.lqip}
      projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
      dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
      queryParams={{ fm: "webp" }}
      {...props}
    ></Image>
  );
}
