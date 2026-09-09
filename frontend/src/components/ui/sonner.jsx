"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-ink group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans",
          description: "group-[.toast]:text-ink-muted",
          actionButton:
            "group-[.toast]:bg-accent group-[.toast]:text-white font-medium",
          cancelButton:
            "group-[.toast]:bg-surface-2 group-[.toast]:text-ink",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
export default Toaster;
