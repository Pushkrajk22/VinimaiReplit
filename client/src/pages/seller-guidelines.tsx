import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Star, DollarSign, Package, Shield, Clock, AlertTriangle } from "lucide-react";

export default function SellerGuidelines() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Guidelines</h1>
          <p className="text-gray-600">Everything you need to know to succeed as a seller on Vinimai</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose max-w-none">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-green-900 m-0">Welcome to Vinimai Sellers</h2>
            </div>
            <p className="text-green-800 m-0">
              Join our community of individual sellers who are earning by selling their personal items on India's 
              most trusted peer-to-peer marketplace. Follow these guidelines for a smooth selling experience.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Account Setup</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Verify your mobile number via OTP during registration</li>
                    <li>Complete your seller profile with accurate information</li>
                    <li>Add a clear profile photo and business description</li>
                    <li>Set up your preferred payment methods</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">First Listing</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Start with 1-2 products to test the platform</li>
                    <li>Choose products you know well and can describe accurately</li>
                    <li>Take high-quality photos from multiple angles</li>
                    <li>Set competitive but fair prices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Creating Great Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Product Photos</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Use natural lighting or well-lit indoor spaces</li>
                    <li>Show the product from front, back, and side angles</li>
                    <li>Include close-ups of important details or any defects</li>
                    <li>Use a clean, uncluttered background</li>
                    <li>Ensure photos are sharp and in focus</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Product Descriptions</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Write clear, detailed titles with relevant keywords</li>
                    <li>Include brand, model, size, color, and condition</li>
                    <li>Mention any accessories or original packaging included</li>
                    <li>Be honest about wear, damage, or missing parts</li>
                    <li>Use bullet points for easy reading</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Pricing Strategy</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Research similar products to set competitive prices</li>
                    <li>Consider the condition and age of your item</li>
                    <li>Factor in our 3% platform fee</li>
                    <li>Leave room for negotiation</li>
                    <li>Update prices if items aren't getting offers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Platform Fee & Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How Our Platform Fee Works</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                    <li>We charge 3% platform fee from both buyer and seller</li>
                    <li>Seller receives: Sale Price - 3% platform fee</li>
                    <li>Example: ₹1000 sale = ₹970 to seller, ₹30 platform fee</li>
                    <li>Platform fee is automatically deducted during payment processing</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Payment Process</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Payments are processed through secure Razorpay gateway</li>
                    <li>Funds are released after successful delivery confirmation</li>
                    <li>Payment timeline: 2-3 business days after delivery</li>
                    <li>Direct bank transfer to your registered account</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Managing Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Order Fulfillment</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Respond to offers within 24 hours</li>
                    <li>Package items securely to prevent damage</li>
                    <li>Ship within 1-10 business days of payment</li>
                    <li>Provide tracking information promptly</li>
                    <li>Communicate any delays immediately</li>
                  </ul>
                </div>


              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Seller Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Avoiding Scams</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Never complete transactions outside the platform</li>
                    <li>Don't share personal contact information</li>
                    <li>Be wary of buyers asking for immediate shipping</li>
                    <li>Report suspicious buyer behavior</li>
                    <li>Use our secure payment system only</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Handling Disputes</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Document all communications and transactions</li>
                    <li>Keep shipping receipts and tracking information</li>
                    <li>Contact support immediately if issues arise</li>
                    <li>Provide evidence to support your case</li>
                    <li>Follow our dispute resolution process</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Prohibited Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 mb-4">The following items cannot be sold on Vinimai:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prohibited Categories</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      <li>Weapons and ammunition</li>
                      <li>Illegal drugs and substances</li>
                      <li>Counterfeit or pirated goods</li>
                      <li>Adult content and services</li>
                      <li>Live animals and plants</li>
                      <li>Hazardous materials</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Restricted Items</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      <li>Prescription medications</li>
                      <li>Recalled or unsafe products</li>
                      <li>Items requiring special licenses</li>
                      <li>Damaged or broken items (unless clearly stated)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>

          <div className="mt-8 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Our seller support team is here to help you succeed on Vinimai.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/list-product">List Your First Product</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}