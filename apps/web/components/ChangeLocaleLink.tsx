"use client";
import React, { type ReactNode } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "../i18n/navigation";

type Props = {
  locale: string;
  children: ReactNode;
};

const ChangeLocaleLink = ({ locale, children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => {
        router.replace(pathname, { locale });
      }}
    >
      {children}
    </Button>
  );
};

export default ChangeLocaleLink;
