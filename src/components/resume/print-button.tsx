"use client";

import { PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button variant="outline" className="print:hidden" onClick={() => window.print()}>
      <PrinterIcon />
      Print
    </Button>
  );
}
