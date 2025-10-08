// password-vault-master\src\components\PasswordGenerator.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
  initialPassword?: string;
}

export default function PasswordGenerator({ 
  onPasswordGenerated, 
  initialPassword = "" 
}: PasswordGeneratorProps) {
  const [length, setLength] = useState([12]);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState(initialPassword);

  const generatePassword = () => {
    let charset = "";
    
    if (includeLetters) {
      charset += excludeLookAlikes 
        ? "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ" 
        : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    
    if (includeNumbers) {
      charset += excludeLookAlikes ? "23456789" : "0123456789";
    }
    
    if (includeSymbols) {
      charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    }

    if (!charset) {
      toast.error("Please select at least one character type");
      return;
    }

    let password = "";
    for (let i = 0; i < length[0]; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(password);
    onPasswordGenerated(password);
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast.success("Password copied to clipboard");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Password Generator</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generatePassword}
          className="gap-2"
        >
          <RefreshCw className="h-3 w-3" />
          Generate
        </Button>
      </div>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Generated Password</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-background border rounded text-sm font-mono break-all">
              {generatedPassword}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Length Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-xs">Length</Label>
          <span className="text-xs text-muted-foreground">{length[0]} characters</span>
        </div>
        <Slider
          value={length}
          onValueChange={setLength}
          max={50}
          min={4}
          step={1}
          className="w-full"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="letters"
            checked={includeLetters}
            onCheckedChange={(checked) => setIncludeLetters(checked === true)}
          />
          <Label htmlFor="letters" className="text-xs">Letters (A-Z, a-z)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="numbers"
            checked={includeNumbers}
            onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
          />
          <Label htmlFor="numbers" className="text-xs">Numbers (0-9)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="symbols"
            checked={includeSymbols}
            onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
          />
          <Label htmlFor="symbols" className="text-xs">Symbols (!@#$%)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="exclude-lookalikes"
            checked={excludeLookAlikes}
            onCheckedChange={(checked) => setExcludeLookAlikes(checked === true)}
          />
          <Label htmlFor="exclude-lookalikes" className="text-xs">Exclude look-alikes</Label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {excludeLookAlikes && "Excludes: 0, O, I, l, 1"}
      </p>
    </div>
  );
}