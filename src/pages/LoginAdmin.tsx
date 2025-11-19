import AdminAuthAPI from "@/api/admin/auth/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/use-typed-selector";
import { setCredentials } from "@/provider/slices/authSlice";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginAdmin = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      try {
        setIsSubmitting(true);
        const data = await AdminAuthAPI.login({ email, password });
        dispatch(
          setCredentials({
            token: data.data.token,
            user: data.data,
          })
        );
        navigate("/admin");
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || error.response.data.message,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // const success = await register(email, password, name);
      // if (success) {
      //   onClose();
      //   setEmail('');
      //   setPassword('');
      //   setName('');
      // } else {
      //   setError('Registration failed');
      // }
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="h-[100vh] flex w-full justify-center items-center">
      <div className="w-[400px]">
        {/* Logo */}
        <div className="flex my-7 justify-center items-center space-x-2">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm lg:text-base">S</span>
          </div>
          <p className="hidden sm:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Screenboard
          </p>
        </div>
        <h4 className="text-2xl font-bold text-center">Welcome Back</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          {/* <div className="text-center">
            <Button variant="link" onClick={toggleMode} className="text-sm">
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div> */}
        </form>
      </div>
    </div>
  );
};
