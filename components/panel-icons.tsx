import type { SVGProps } from "react";

import {
  HiArrowRightOnRectangle,
  HiBell,
  HiClock,
  HiCog6Tooth,
  HiMoon,
  HiStar,
  HiSun,
  HiTicket,
  HiUser,
  HiUsers,
} from "react-icons/hi2";
import { MdOutlineLocalParking } from "react-icons/md";

import { cn } from "@/lib/utils";

/** Sidebar / nav link icons */
export const navIconClass = "size-[1.125rem] shrink-0";

/** Header icon buttons (bell, theme) — matches `size="icon"` buttons */
export const headerIconClass = "size-4";

type SvgProps = SVGProps<SVGSVGElement>;

export function IconKasjerzy({ className, ...props }: SvgProps) {
  return (
    <HiUser
      className={cn(navIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconKlienci({ className, ...props }: SvgProps) {
  return (
    <HiUsers
      className={cn(navIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconKupony({ className, ...props }: SvgProps) {
  return (
    <HiTicket
      className={cn(navIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconParkingNav({ className, ...props }: SvgProps) {
  return (
    <MdOutlineLocalParking
      className={cn(navIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconLojalnosc({ className, ...props }: SvgProps) {
  return (
    <HiStar
      className={cn(navIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconUstawienia({ className, ...props }: SvgProps) {
  return (
    <HiCog6Tooth
      className={cn(navIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

/** Wyloguj / wyjście — sidebar */
export function IconLogout({ className, ...props }: SvgProps) {
  return (
    <HiArrowRightOnRectangle
      className={cn(navIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconBell({ className, ...props }: SvgProps) {
  return (
    <HiBell
      className={cn(headerIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconSun({ className, ...props }: SvgProps) {
  return (
    <HiSun
      className={cn(headerIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconMoon({ className, ...props }: SvgProps) {
  return (
    <HiMoon
      className={cn(headerIconClass, className)}
      aria-hidden
      {...props}
    />
  );
}

export function IconClock({ className, ...props }: SvgProps) {
  return (
    <HiClock className={cn("size-4", className)} aria-hidden {...props} />
  );
}
