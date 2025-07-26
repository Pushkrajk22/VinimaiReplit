import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Smartphone } from "lucide-react";

interface OTPVerificationProps {
  mobile: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export function OTPVerification({ mobile, onVerificationSuccess, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = React.useState("");
  const { toast } = useToast();

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { mobile: string; otp: string }) => {
      return apiRequest("POST", "/api/auth/verify-otp", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Mobile number verified successfully!",
      });
      onVerificationSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        variant: "destructive",
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/send-otp", { mobile });
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your mobile number",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    verifyOtpMutation.mutate({ mobile, otp });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8" />
        </div>
        <CardTitle>Verify Mobile Number</CardTitle>
        <CardDescription>
          Enter the 6-digit OTP sent to {mobile}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={verifyOtpMutation.isPending || otp.length !== 6}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Continue"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive OTP?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => resendOtpMutation.mutate()}
              disabled={resendOtpMutation.isPending}
              className="text-primary"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
