import * as Dialog from "@radix-ui/react-dialog";

export function MDialog({
  children,
  isOpen,
  title,
  onClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 flex items-center justify-center bg-gray opacity-70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-20 h-screen w-screen -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white px-6 py-8 shadow-lg md:h-max md:max-h-[90%] md:w-max md:rounded-2xl">
          <h2 className="pb-8 text-xl font-semibold">{title}</h2>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className={"overflow-scroll " + isOpen ? "" : "hidden"}>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-20 flex items-center justify-center bg-gray opacity-70 `}
      ></div>
      <div className="fixed left-1/2 top-1/2 z-20 h-screen w-screen -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-6 py-8 shadow-lg md:h-max md:w-max">
        <h2 className="pb-8 text-xl font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
