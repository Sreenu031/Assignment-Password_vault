"use client";

import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import PasswordGenerator from "./PasswordGenerator";

const passwordSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  notes: z.string().optional(),
});

interface AddPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (password: z.infer<typeof passwordSchema>) => void;
}

export default function AddPasswordDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPasswordDialogProps) {
  const [showGenerator, setShowGenerator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof passwordSchema>) => {
    onAdd(values);
    form.reset();
    setShowGenerator(false);
    setShowPassword(false);
  };

  const handlePasswordGenerated = (password: string) => {
    form.setValue("password", password);
  };

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setShowGenerator(false);
      setShowPassword(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
          <DialogDescription>
            Add a new password to your vault. All data will be encrypted.
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
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password or generate one" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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
              <Button type="submit">Add Password</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}