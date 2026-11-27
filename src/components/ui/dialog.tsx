"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/40 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

export type DialogSize = "sm" | "md" | "lg" | "xl"

const DIALOG_SIZE_CLASSES: Record<DialogSize, string> = {
  sm: "w-[92vw] sm:max-w-md md:max-w-lg",
  md: "w-[94vw] sm:max-w-xl md:max-w-2xl",
  lg: "w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl",
  xl: "w-[96vw] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-[1180px]",
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "md",
  stickyLayout = false,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  size?: DialogSize
  stickyLayout?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-sticky={stickyLayout ? "true" : undefined}
        className={cn(
          "group/dialog fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface text-sm text-on-surface ring-1 ring-outline-variant/30 duration-150 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          stickyLayout
            ? "flex flex-col max-h-[90dvh] overflow-hidden p-0 gap-0"
            : "grid max-h-[92dvh] overflow-y-auto gap-5 p-5 sm:p-6 md:p-8",
          DIALOG_SIZE_CLASSES[size],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                aria-label="Đóng hộp thoại"
                className="absolute top-4 right-4 z-10 size-9 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
                size="icon-sm"
              />
            }
          >
            <XIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Đóng</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-1.5 pr-12",
        "group-data-[sticky=true]/dialog:shrink-0 group-data-[sticky=true]/dialog:px-5 group-data-[sticky=true]/dialog:sm:px-6 group-data-[sticky=true]/dialog:md:px-8 group-data-[sticky=true]/dialog:pt-5 group-data-[sticky=true]/dialog:sm:pt-6 group-data-[sticky=true]/dialog:pb-4 group-data-[sticky=true]/dialog:border-b group-data-[sticky=true]/dialog:border-outline-variant/25",
        className
      )}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 md:px-8 py-5",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2.5 pt-4 border-t border-outline-variant/25 sm:flex-row sm:justify-end",
        "group-data-[sticky=true]/dialog:shrink-0 group-data-[sticky=true]/dialog:px-5 group-data-[sticky=true]/dialog:sm:px-6 group-data-[sticky=true]/dialog:md:px-8 group-data-[sticky=true]/dialog:py-4 group-data-[sticky=true]/dialog:bg-surface",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Đóng
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg sm:text-xl leading-tight font-serif font-bold text-primary text-balance", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-on-surface-variant text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
