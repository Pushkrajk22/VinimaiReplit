import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const offerSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be a positive number"
  ),
  message: z.string().optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface OfferModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OfferModal({ product, open, onOpenChange }: OfferModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      amount: "",
      message: "",
    },
  });

  const offerMutation = useMutation({
    mutationFn: async (data: OfferFormData) => {
      if (!product) throw new Error("No product selected");
      
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          sellerId: product.sellerId,
          amount: data.amount,
          message: data.message,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit offer: ${response.statusText}`);
      }
      
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Offer Submitted",
        description: "Your offer has been sent to the seller. You'll be notified when they respond.",
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit offer",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OfferFormData) => {
    offerMutation.mutate(data);
  };

  const calculateFees = (amount: number) => {
    const fee = amount * 0.03;
    return {
      buyerTotal: amount + fee,
      sellerReceives: amount - fee,
      platformFee: fee * 2,
    };
  };

  const offerAmount = Number(form.watch("amount")) || 0;
  const fees = calculateFees(offerAmount);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            {product?.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="amount">Your Offer Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              {...form.register("amount")}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.amount.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Original price: {product ? formatPrice(Number(product.price)) : ""}
            </p>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to the seller..."
              {...form.register("message")}
              rows={3}
            />
          </div>

          {offerAmount > 0 && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Pricing Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Your Offer:</span>
                  <span>{formatPrice(offerAmount)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>You'll Pay:</span>
                  <span className="font-medium">{formatPrice(fees.buyerTotal)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Seller Receives:</span>
                  <span>{formatPrice(fees.sellerReceives)}</span>
                </div>
                <div className="text-xs text-muted-foreground pt-1 border-t">
                  3% platform fee from both parties
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={offerMutation.isPending || !form.formState.isValid}
            >
              {offerMutation.isPending ? "Submitting..." : "Submit Offer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
