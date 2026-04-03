"use client";

import { IconMoon, IconSun } from "@/components/panel-icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { toggleTheme, theme, mounted } = useTheme();

  if (!mounted) {
    return <div className="size-9 shrink-0" aria-hidden />;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={theme === "dark" ? "Tryb jasny" : "Tryb ciemny"}
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </Button>
  );
}
