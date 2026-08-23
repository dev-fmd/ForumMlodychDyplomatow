import type { InferFragmentType } from "groqd";
import React from "react";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsSpotify,
  BsTwitterX,
  BsYoutube,
} from "react-icons/bs";
import type { socialsFragment } from "../../sanity/queries/socialsFragment";
import { cn } from "../../lib/utils";
type Socials = Array<InferFragmentType<typeof socialsFragment>> | null | undefined;
type Props = {
  socials: Socials;
  className?: string;
};
const iconClassName = "desktop:size-6 size-6 shrink-0";
const icons = {
  facebook: <BsFacebook className={iconClassName} />,
  instagram: <BsInstagram className={iconClassName} />,
  linkedin: <BsLinkedin className={iconClassName} />,
  spotify: <BsSpotify className={iconClassName} />,
  twitter: <BsTwitterX className={iconClassName} />,
  youtube: <BsYoutube className={iconClassName} />,
} satisfies Record<Exclude<NonNullable<Socials>[number]["platform"], null>, React.ReactNode>;
export const SocialIcons = ({ socials, className }: Props) => {
  if (socials == null || socials.length === 0) return null;
  return (
    <div
      className={cn(
        "flex h-10 flex-row flex-wrap gap-4 text-[1.5rem] text-brand-red-900 desktop:h-6",
        className
      )}
    >
      {socials.map((social) => {
        if (social.platform === null || social.url === null) return null;
        const Icon = icons[social.platform];
        if (!Icon) return null;
        return (
          <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer">
            {Icon}
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
