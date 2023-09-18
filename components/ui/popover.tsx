"use";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    { className, align = "center", sideOffset = 4, children, ...props },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          className
        )}
        {...props}
      >
        <PopoverPrimitive.Close>{children}</PopoverPrimitive.Close>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };

// Possibly add Popover.Primitive.Close to all popover actions

// import * as React from "react";
// import * as PopoverPrimitive from "@radix-ui/react-popover";

// import { cn } from "@/lib/utils";

// const Popover = PopoverPrimitive.Root;
// const PopoverTrigger = PopoverPrimitive.Trigger;

// const PopoverContent = React.forwardRef<
//   React.ElementRef<typeof PopoverPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
// >(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => (
//   <PopoverPrimitive.Portal>
//     <PopoverPrimitive.Content
//       ref={ref}
//       align={align}
//       sideOffset={sideOffset}
//       className={cn(
//         "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
//         className
//       )}
//       {...props}
//     >
//       <PopoverPrimitive.Close>
//         {children}
//       </PopoverPrimitive.Close>
//     </PopoverPrimitive.Content>
//   </PopoverPrimitive.Portal>
// ));

// PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// export { Popover, PopoverTrigger, PopoverContent };
