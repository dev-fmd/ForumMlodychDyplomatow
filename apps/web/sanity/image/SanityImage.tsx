import { ComponentProps, ElementType } from "react";
import { SanityImage as Image, type CropData } from "sanity-image";
import type { GradientImgFragment, ImgFragment } from "../queries/imgFragment";
import ClientSvg from "./ClientSvg";
import { PLACEHOLDERS, type PlaceholderVariant } from "./placeholders";
type Sizes =
  | string
  | Partial<Record<"default" | "desktop" | "sm" | "md" | "lg" | "xl" | "2xl", string>>
  | undefined;

export type SanityImageProps = {
  image?: ImgFragment | GradientImgFragment | null;
  preview?: boolean;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  mode?: "cover" | "contain";
  className?: string;
  as?: ElementType;
  sizes?: Sizes;
  svgNoColor?: boolean;
  /** Which fallback to render when the image is missing. @see PLACEHOLDERS */
  placeholder?: PlaceholderVariant;
} & Omit<ComponentProps<"img">, "sizes" | "placeholder">;

const minWidthMap = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  desktop: "768px",
};

const getSizes = (sizes: Sizes): string | undefined => {
  if (!sizes) return undefined;
  if (typeof sizes === "string") return sizes;

  return Object.entries(sizes)
    .map(([key, value]) =>
      key in minWidthMap
        ? `(min-width: ${minWidthMap[key as keyof typeof minWidthMap]}) ${value}`
        : value
    )
    .filter(Boolean)
    .join(", ");
};

/**
 * Component for rendering Sanity images
 * @see https://www.sanity.io/plugins/sanity-image
 */
export function SanityImage({
  image,
  preview,
  sizes,
  placeholder = "default",
  svgNoColor,
  ...props
}: SanityImageProps) {
  const alt = props.alt ?? image?.asset?.altText ?? "";
  const sizesValue = getSizes(sizes);

  const asset = image?.asset;
  if (!asset?.url) {
    return (
      // Static local placeholder — no Next.js image optimization needed.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={PLACEHOLDERS[placeholder]}
        alt={alt}
        width={props.width}
        height={props.height}
        sizes={sizesValue}
        className={props.className}
      />
    );
  }

  const id = (asset as { _ref?: string; _id?: string })._ref ?? asset._id;

  if (preview && typeof window === "undefined") {
    throw new Error("Image preview can only be used in client components");
  }
  if (asset.extension === "svg" && typeof asset.url === "string") {
    return <ClientSvg id={id} src={asset.url} className={props.className} noColor={svgNoColor} />;
  }

  return (
    <Image
      id={id}
      alt={alt}
      hotspot={image?.hotspot as { x: number; y: number }}
      crop={image?.crop as CropData}
      preview={preview ? asset.metadata?.lqip || undefined : undefined}
      projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
      dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
      sizes={sizesValue}
      queryParams={{ fm: "webp" }}
      {...props}
    ></Image>
  );
}
