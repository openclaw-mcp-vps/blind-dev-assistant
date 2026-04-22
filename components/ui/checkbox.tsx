import * as React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border border-slate-500 bg-slate-950 text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
