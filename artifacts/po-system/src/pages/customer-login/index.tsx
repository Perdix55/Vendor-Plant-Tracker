import { useState } from "react";
import { useLocation } from "wouter";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ArrowLeft } from "lucide-react";

type Mode = "login" | "setup" | "forgot" | "forgot-need-email" | "sent";

export default function CustomerLoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [customerNumber, setCustomerNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState("");
  const { setCustomer } = useCustomerAuth();
  const [, navigate] = useLocation();

  const resetMessages = () => setError("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/customer-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNumber: Number(customerNumber), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.needsSetup) {
          setMode("setup");
          setPassword("");
          return;
        }
        throw new Error(data.error || "Login failed");
      }
      setCustomer(data);
      navigate("/shop");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/customer-auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNumber: Number(customerNumber), password, email: email || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to set password");
      setCustomer(data);
      navigate("/shop");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/customer-auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNumber: Number(customerNumber), email: email || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (data.needsEmail) {
        setMode("forgot-need-email");
        return;
      }
      setSentMessage(data.message || "Check your email for a reset link.");
      setMode("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/customer-auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerNumber: Number(customerNumber), email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSentMessage(data.message || "Check your email for a reset link.");
      setMode("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToLogin = () => {
    setMode("login");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <Leaf className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Vickery Wholesale</h1>
            <p className="text-sm text-muted-foreground mt-1">Customer Shop Login</p>
          </div>
        </div>

        {mode === "login" && (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sign In</CardTitle>
              <CardDescription>Enter your customer number and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customerNumber">Customer Number</Label>
                  <Input
                    id="customerNumber"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 1024"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    autoFocus
                    required
                    data-testid="input-customer-number"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-customer-password"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-customer-login">
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground underline w-full text-center"
                  onClick={() => { setMode("forgot"); setError(""); }}
                  data-testid="link-forgot-password"
                >
                  Forgot password?
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {mode === "setup" && (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Set Up Your Account</CardTitle>
              <CardDescription>Looks like this is your first time. Choose a password to secure your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Customer Number</Label>
                  <Input value={customerNumber} disabled />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-email">Email (required for account recovery)</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-setup-email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-setup-password"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    data-testid="input-setup-confirm-password"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-setup-password">
                  {isSubmitting ? "Setting up..." : "Create Password"}
                </Button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground underline w-full text-center flex items-center justify-center gap-1"
                  onClick={backToLogin}
                >
                  <ArrowLeft className="h-3 w-3" /> Back to sign in
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {mode === "forgot" && (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Reset Password</CardTitle>
              <CardDescription>Enter your customer number and we'll email you a reset link.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-customer-number">Customer Number</Label>
                  <Input
                    id="forgot-customer-number"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 1024"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    autoFocus
                    required
                    data-testid="input-forgot-customer-number"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-send-reset">
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground underline w-full text-center flex items-center justify-center gap-1"
                  onClick={backToLogin}
                >
                  <ArrowLeft className="h-3 w-3" /> Back to sign in
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {mode === "forgot-need-email" && (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Add Your Email</CardTitle>
              <CardDescription>We don't have an email on file for this account yet. Add one so we can send you a reset link.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotWithEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                    data-testid="input-forgot-email"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-send-reset-with-email">
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground underline w-full text-center flex items-center justify-center gap-1"
                  onClick={backToLogin}
                >
                  <ArrowLeft className="h-3 w-3" /> Back to sign in
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {mode === "sent" && (
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Check Your Email</CardTitle>
              <CardDescription>{sentMessage}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={backToLogin} data-testid="button-back-to-login-sent">
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
