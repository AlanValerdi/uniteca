import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ActionDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export function ActionDialog({ isOpen, setIsOpen, onConfirm, title, description }: ActionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title ?? "Are you sure?"}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">{description ?? "This action cannot be undone."}</DialogDescription>

        </DialogHeader>
        <DialogFooter>
            <Button variant="ghost" className="hover:bg-red-100 cursor-pointer" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button className="bg-green-600 hover:bg-green-700 cursor-pointer" onClick={() => {
            onConfirm();
            setIsOpen(false);
          }}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
     
  );
}

