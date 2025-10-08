import { Shield, Lock, Key, Eye, Zap, FileCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Digital Vault for
            <span className="block text-primary mt-2">Password Security</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Store, manage, and protect all your passwords in one secure location. 
            Never forget a password again with our encrypted password vault.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Our Password Vault?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card border border-border space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Military-Grade Encryption</h3>
              <p className="text-muted-foreground">
                Your passwords are protected with AES-256 encryption, the same standard used by banks and governments worldwide.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Single Master Password</h3>
              <p className="text-muted-foreground">
                Remember just one master password to access all your stored credentials. Simplify your digital life.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Zero-Knowledge Architecture</h3>
              <p className="text-muted-foreground">
                We can&apos;t see your passwords. Your data is encrypted locally before it ever leaves your device.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Auto-Fill & Sync</h3>
              <p className="text-muted-foreground">
                Automatically fill passwords across all your devices with seamless synchronization.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Password Health Check</h3>
              <p className="text-muted-foreground">
                Get alerts about weak, reused, or compromised passwords to keep your accounts secure.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 w-fit">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Sharing</h3>
              <p className="text-muted-foreground">
                Safely share passwords with team members or family without exposing sensitive data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Vault</h3>
                <p className="text-muted-foreground">
                  Sign up and create a master password. This is the only password you&apos;l need to remember.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Add Your Passwords</h3>
                <p className="text-muted-foreground">
                  Store all your login credentials, credit cards, and secure notes in your encrypted vault.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
                <p className="text-muted-foreground">
                  Access your passwords securely from any device, anytime you need them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of users who trust our password vault to keep their credentials safe.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
