import React, { ReactNode } from 'react';
import { Button, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode;
  actionButtonText: string;
  onAction: () => void;
}

export default function Modal ({ isOpen, onClose, title, content, actionButtonText, onAction }: ModalProps) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 transition-all data-[closed]:translate-y-4 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-center">
              {title}
            </DialogTitle>
            <div className="mt-2">
              {content}
            </div>
            <div className="mt-4">
              <Button
                className="w-full gap-2 rounded-md bg-[#0800FA] py-1.5 font-semibold text-white"
                onClick={onAction}
              >
                {actionButtonText}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}