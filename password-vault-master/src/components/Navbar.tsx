"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();

  // Check if user is on dashboard (authenticated pages)
  const isDashboard = pathname === "/Dashboard";

  const handleLogout = () => {
    // TODO: Add actual logout logic
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
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

          <div className="flex items-center space-x-2">
            {isDashboard ? (
              // Dashboard page - ONLY show logout button, HIDE signup/login
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              // Non-dashboard pages - show login/signup buttons, HIDE logout
              <>
                {pathname !== "/login" && (
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                )}
                {pathname !== "/signup" && (
                  <Button variant="outline" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                )}
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}