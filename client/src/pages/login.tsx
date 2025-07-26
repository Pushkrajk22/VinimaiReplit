import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPVerification } from "@/components/auth/otp-verification";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Smartphone } from "lucide-react";

const loginSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be 10 digits").max(10, "Mobile number must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showOTP, setShowOTP] = React.useState(false);
  const [mobile, setMobile] = React.useState("");
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (mobile: string) => {
      return apiRequest("POST", "/api/auth/send-otp", { mobile });
    },
    onSuccess: () => {
      setShowOTP(true);
      toast({
        title: "OTP Sent",
        description: "Please check your mobile for the verification code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setMobile(data.mobile);
    // First send OTP for verification
    sendOtpMutation.mutate(data.mobile);
  };

  const handleOTPVerificationSuccess = () => {
    // After OTP verification, proceed with login
    const formData = form.getValues();
    loginMutation.mutate(formData);
  };

  const handleBack = () => {
    setShowOTP(false);
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <OTPVerification
          mobile={mobile}
          onVerificationSuccess={handleOTPVerificationSuccess}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Sign In to Vinimai</CardTitle>
          <CardDescription>
            Enter your mobile number and password to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                  +91
                </span>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="9876543210"
                  className="rounded-l-none"
                  {...form.register("mobile")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    e.target.value = value;
                    form.setValue("mobile", value);
                  }}
                />
              </div>
              {form.formState.errors.mobile && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={sendOtpMutation.isPending || !form.formState.isValid}
            >
              {sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              New to Vinimai?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
