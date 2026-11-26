"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  asChild,
  render,
  children,
  ...props
}: SheetPrimitive.Close.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <SheetPrimitive.Close
        data-slot="sheet-close"
        render={children as React.ReactElement}
        {...props}
      />
    )
  }
  return (
    <SheetPrimitive.Close data-slot="sheet-close" render={render} {...props}>
      {children}
    </SheetPrimitive.Close>
  )
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fill-mode-forwards",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  overlayClassName,
  children,
  side = "right",
  showCloseButton = true,
  fullScreen = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  fullScreen?: boolean
  overlayClassName?: string
}) {
  return (
    <SheetPortal>
      {/* Không render overlay nếu là fullScreen để tránh chớp nháy compositing 2 lớp */}
      {!fullScreen && (
        <SheetOverlay className={overlayClassName} />
      )}
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col bg-surface text-on-surface shadow-2xl focus:outline-none will-change-transform",
          side === "left" && (fullScreen
            ? "inset-0 h-full w-full max-w-full"
            : "inset-y-0 left-0 h-full w-full sm:max-w-md border-r border-outline-variant/30"),
          side === "right" && (fullScreen
            ? "inset-0 h-full w-full max-w-full"
            : "inset-y-0 right-0 h-full w-full sm:max-w-md border-l border-outline-variant/30"),
          side === "left" && "duration-200 ease-out data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left data-closed:translate-x-[-100%] fill-mode-forwards",
          side === "right" && "duration-200 ease-out data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right data-closed:translate-x-full fill-mode-forwards",
          side === "top" && "duration-200 ease-out data-open:animate-in data-open:slide-in-from-top data-closed:animate-out data-closed:slide-out-to-top fill-mode-forwards",
          side === "bottom" && "duration-200 ease-out data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom fill-mode-forwards",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3.5 right-3.5 z-50 h-8 w-8 p-0 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary bg-surface-container/60 hover:bg-surface-container active:scale-95 cursor-pointer"
              />
            }
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1 p-4 border-b border-outline-variant/30", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4 border-t border-outline-variant/30", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base font-bold text-on-surface", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-xs text-outline", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
