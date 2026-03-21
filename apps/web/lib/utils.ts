import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes without style conflicts. (Combines twMerge and clsx)
 * @see https://github.com/dcastil/tailwind-merge
 * @see https://github.com/lukeed/clsx
 * @example
 * cn("px-2 py-1", "p-3") // => "p-3"
 * cn("text-red-500", isActive && "text-blue-500") // => "text-blue-500" (if isActive)
 * cn("flex", undefined, "gap-2") // => "flex gap-2"
 * cn({ "bg-blue-500": isActive, "bg-gray-500": !isActive }) // => "bg-blue-500" (if isActive)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
