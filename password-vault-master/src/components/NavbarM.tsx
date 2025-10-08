"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const handleLogout = () => {
    // TODO: Add actual logout logic
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Password Vault</h1>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}