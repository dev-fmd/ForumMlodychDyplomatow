import { PortableText } from "next-sanity";
import { components } from "./components";

/**
 * Renders Sanity blocks (Portable Text).
 * @param value - Block object fetched from Sanity
 */
export function SanityRichText({ value = [] }: { value: Array<any> | null | undefined }) {
  if (!Array.isArray(value)) return null;
  return (
    <PortableText
      value={value}
      components={components}
      onMissingComponent={(message, _options) => console.warn(message)}
    />
  );
}
