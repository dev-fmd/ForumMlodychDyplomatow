"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import MenuIcon from "./MenuIcon";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  children?: React.ReactNode;
};

const MobileMenu = ({ children }: Props) => {
  const t = useTranslations("navigation");
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    setIsOpen(false);
  }, [path]);
  return (
    <div className="flex justify-self-end lg:hidden">
      <Sheet open={isOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(true)}
            className="px-0 text-brand-red-900"
          >
            <MenuIcon />
            <span className="sr-only">{t("menu")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          showOverlay={false}
          side="right"
          className="top-(--header-height-mobile)! z-40 max-h-[calc(100vh-var(--header-height-mobile))] w-full max-w-screen overflow-y-scroll px-4 pb-8"
        >
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
