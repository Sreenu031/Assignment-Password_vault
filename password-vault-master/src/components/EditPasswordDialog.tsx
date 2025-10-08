"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordGenerator from "./PasswordGenerator";

const passwordSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  notes: z.string().optional(),
});

interface PasswordItem {
  id: string;
  title: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
}

interface EditPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: PasswordItem;
  onEdit: (password: PasswordItem) => void;
}

export default function EditPasswordDialog({
  open,
  onOpenChange,
  password,
  onEdit,
}: EditPasswordDialogProps) {
  const [showGenerator, setShowGenerator] = useState(false);
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (password) {
      form.reset({
        title: password.title,
        username: password.username,
        password: password.password,
        notes: password.notes || "",
      });
    }
  }, [password, form]);

  const onSubmit = (values: z.infer<typeof passwordSchema>) => {
    onEdit({
      ...password,
      ...values,
    });
    setShowGenerator(false);
  };

  const handlePasswordGenerated = (generatedPassword: string) => {
    form.setValue("password", generatedPassword);
  };

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setShowGenerator(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
          <DialogDescription>
            Update your password information.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gmail, Facebook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowGenerator(!showGenerator)}
                      className="text-xs"
                    >
                      {showGenerator ? "Hide Generator" : "Show Generator"}
                    </Button>
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter password or generate one" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Generator */}
            {showGenerator && (
              <PasswordGenerator
                onPasswordGenerated={handlePasswordGenerated}
                initialPassword={form.getValues("password")}
              />
            )}
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Password</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}