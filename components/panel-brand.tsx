"use client";

import Image from "next/image";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const LOGO_LIGHT = "/logo-bangkok-light.png";
const LOGO_DARK = "/logo-bangkok.png";

type PanelBrandProps = {
  className?: string;
  variant?: "sidebar" | "login";
};

export function PanelBrand({ className, variant = "sidebar" }: PanelBrandProps) {
  const { theme, mounted } = useTheme();
  const src = mounted && theme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  return (
    <div
      className={cn(
        "flex items-center w-full justify-center",
        variant === "login" && "justify-center",
        className
      )}
    >
      <Image
        key={src}
        src={src}
        alt="Bangkok Masaż Tajski & Spa"
        width={360}
        height={96}
        className={cn(
          "w-auto object-contain object-left",
          variant === "sidebar" &&
            "h-7 max-h-7 max-w-[min(100%,220px)] md:h-8 md:max-h-8 md:max-w-[260px]",
          variant === "login" &&
            "h-10 max-w-[min(88vw,300px)] sm:h-12 md:h-14 md:max-w-[340px]"
        )}
        priority
      />
    </div>
  );
}
