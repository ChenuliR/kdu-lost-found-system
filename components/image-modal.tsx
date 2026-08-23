"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import Image from "next/image";

export default function ImageModal({
  imageUrl,
  itemName,
}: {
  imageUrl: string;
  itemName: string;
}) {
  return (
    <Dialog>
      <DialogTrigger
        className="absolute bottom-3 right-3 cursor-pointer"
        render={
          <Button size={"icon-sm"}>
            <Maximize2 />
          </Button>
        }
      />
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl max-h-[90vh] p-0 flex items-center justify-center bg-black/90 rounded-sm overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={itemName}
          width={1200}
          height={1200}
          className="object-contain w-full h-full max-w-4xl max-h-[90vh]"
        />
      </DialogContent>
    </Dialog>
  );
}
