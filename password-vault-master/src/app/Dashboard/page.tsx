"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Edit, Trash2, Plus, Copy } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AddPasswordDialog from "@/components/AddPasswordDialog";
import EditPasswordDialog from "@/components/EditPasswordDialog";
import CryptoJS from "crypto-js";

interface PasswordItem {
  id: string;
  title: string; // encrypted in storage, decrypted for display
  username: string; // encrypted in storage, decrypted for display
  password: string; // encrypted in storage, decrypted for display
  notes?: string; // encrypted in storage, decrypted for display
  createdAt: string;
}

// Interface for encrypted data as stored in backend
interface EncryptedPasswordItem {
  id: string;
  title: string; // ciphertext
  username: string; // ciphertext
  password: string; // ciphertext
  notes?: string; // ciphertext
  createdAt: string;
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    () => new Set()
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  // -- Crypto helpers for all fields
  function getSecretKey() {
    if (typeof window === "undefined") return null;
    return process.env.NEXT_SECRET_KEY;
  }

  function encryptText(text: string, secretKey: string): string {
    if (!text) return "";
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  }

  function decryptText(ciphertext: string, secretKey: string): string {
    if (!ciphertext) return "";
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      console.error("Decrypt failed", err);
      return "";
    }
  }

  // Encrypt all fields of a password item
  function encryptPasswordItem(
    item: Omit<PasswordItem, "id" | "createdAt">,
    secretKey: string
  ): Omit<EncryptedPasswordItem, "id" | "createdAt"> {
    return {
      title: encryptText(item.title, secretKey),
      username: encryptText(item.username, secretKey),
      password: encryptText(item.password, secretKey),
      notes: item.notes ? encryptText(item.notes, secretKey) : "",
    };
  }

  // Decrypt all fields of a password item
  function decryptPasswordItem(
    encryptedItem: EncryptedPasswordItem,
    secretKey: string
  ): PasswordItem {
    return {
      id: encryptedItem.id,
      title: decryptText(encryptedItem.title, secretKey),
      username: decryptText(encryptedItem.username, secretKey),
      password: decryptText(encryptedItem.password, secretKey),
      notes: encryptedItem.notes
        ? decryptText(encryptedItem.notes, secretKey)
        : "",
      createdAt: encryptedItem.createdAt,
    };
  }

  // centralized unauthorized handler
  function handleUnauthorized() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error("Session expired. Please login again");
    router.push("/login");
  }

  useEffect(() => {
    // require secret key present
    const secret = getSecretKey();
    if (!secret) {
      toast.error(
        "Vault secret key missing. Please set a master key before using the vault."
      );
      router.push("/setup-key"); // change to your setup page
      return;
    }

    // require auth token
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchPasswords();

    // cleanup abort
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchPasswords = async () => {
    try {
      const token = localStorage.getItem("token");
      const secret = getSecretKey();
      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }
      if (!secret) {
        toast.error("Missing vault secret key");
        router.push("/setup-key");
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vault`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch passwords");
      }

      const data = await res.json();
      
      // Decrypt all received items for display
      const decryptedPasswords = (data.passwords || []).map(
        (encryptedItem: EncryptedPasswordItem) =>
          decryptPasswordItem(encryptedItem, secret)
      );

      setPasswords(decryptedPasswords);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // ignore
        return;
      }
      console.error("Error fetching passwords:", error);
      toast.error("Failed to fetch passwords");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this password?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vault/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) throw new Error("Failed to delete password");

      setPasswords((prev) => prev.filter((p) => p.id !== id));
      toast.success("Password deleted successfully");
    } catch (error) {
      console.error("Error deleting password:", error);
      toast.error("Failed to delete password");
    }
  };

  // Add: encrypt all fields before sending
  const handleAddPassword = async (
    newPassword: Omit<PasswordItem, "id" | "createdAt">
  ) => {
    try {
      const token = localStorage.getItem("token");
      const secret = getSecretKey();
      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }
      if (!secret) {
        toast.error("Missing vault secret key");
        router.push("/setup-key");
        return;
      }

      // Encrypt all fields
      const encryptedPayload = encryptPasswordItem(newPassword, secret);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vault`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(encryptedPayload),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to add password");
      }

      const data = await res.json();
      
      // Decrypt the returned item for local state
      const decryptedItem = decryptPasswordItem(data.password, secret);
      setPasswords((prev) => [...prev, decryptedItem]);
      setIsAddDialogOpen(false);
      toast.success("Password added successfully");
    } catch (error) {
      console.error("Error adding password:", error);
      toast.error("Failed to add password");
    }
  };

  // Edit: encrypt all fields before sending
  const handleEditPassword = async (updatedPassword: PasswordItem) => {
    try {
      const token = localStorage.getItem("token");
      const secret = getSecretKey();
      if (!token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }
      if (!secret) {
        toast.error("Missing vault secret key");
        router.push("/setup-key");
        return;
      }

      // Encrypt all fields except id and createdAt
      const encryptedPayload = {
        id: updatedPassword.id,
        createdAt: updatedPassword.createdAt,
        ...encryptPasswordItem(updatedPassword, secret),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vault/${updatedPassword.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(encryptedPayload),
        }
      );

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update password");
      }

      // Update local state with decrypted data
      setPasswords((prev) =>
        prev.map((p) => (p.id === updatedPassword.id ? updatedPassword : p))
      );
      setEditingPassword(null);
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Password Vault</h1>
          <p className="text-muted-foreground mt-2">
            Manage your passwords securely
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Password
        </Button>
      </div>

      {passwords.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No passwords yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first password
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Password
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {passwords.map((password) => {
            const isVisible = visiblePasswords.has(password.id);

            return (
              <Card key={password.id} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{password.title}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPassword(password)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(password.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono bg-muted p-2 rounded flex-1">
                        {password.username}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(password.username, "Username")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Password
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono bg-muted p-2 rounded flex-1">
                        {isVisible ? password.password : "••••••••••••"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(password.id)}
                      >
                        {isVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(password.password, "Password")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {password.notes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Notes
                      </label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">
                        {password.notes}
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Added on {new Date(password.createdAt).toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <AddPasswordDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddPassword}
      />

      {editingPassword && (
        <EditPasswordDialog
          open={!!editingPassword}
          onOpenChange={(open: boolean) => {
            if (!open) setEditingPassword(null);
          }}
          password={editingPassword}
          onEdit={handleEditPassword}
        />
      )}
    </div>
  );
}
