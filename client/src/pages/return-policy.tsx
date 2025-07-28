import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Package, Clock, Shield, AlertTriangle } from "lucide-react";

export default function ReturnPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Return & Refund Policy</h1>
          <p className="text-gray-600">Effective Date: June 22, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Our Commitment</h2>
            <p className="text-blue-800">
              At ViniMai.com, we are committed to delivering satisfaction along with your products. 
              In case you are not entirely satisfied with your purchase, we offer a clear and fair return and refund policy.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Return Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Products eligible for return must be returned within <strong>2 days</strong> of delivery</li>
                  <li>Returned products must be unused, in original condition, and with all tags and packaging intact</li>
                  <li>Requests raised beyond this window will not be accepted</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Non-Returnable Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 mb-4">
                  Products specifically marked as "Non-Returnable" on their respective product pages cannot be returned.
                </p>
                <p className="font-semibold text-gray-900">Categories that are generally non-returnable include:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Real estate listings or services</li>
                  <li>Perishables and consumables</li>
                  <li>Customized or made-to-order items</li>
                  <li>Hygiene-sensitive items (e.g., innerwear, cosmetics)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Special Return Policy for Wedding & Luxury Clothing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 mb-4">
                  For items such as wedding attire, luxury garments, and heavy clothing, we offer a "Return at Delivery" service:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You may inspect the item at the time of delivery</li>
                  <li>If not satisfied, you can return the item immediately to the delivery executive</li>
                  <li>Once accepted, no return will be entertained later</li>
                  <li>If the product is damaged during inspection, the customer will be liable and must keep the product</li>
                  <li>Return at Delivery is chargeable as per the refund policy mentioned in section 6</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Valid Reasons for Return
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 mb-4">Return requests are accepted under the following conditions:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Product received in a damaged or broken condition</li>
                  <li>Product is defective or malfunctioning</li>
                  <li>Incorrect product delivered (e.g., incorrect size, color, or product variant)</li>
                  <li>Missing parts or accessories</li>
                  <li>Returns due to change of mind or preference will still be accepted for eligible products, but charges apply (see return charges mentioned in section 6)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Initiate a Return</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 mb-4">To raise a return request:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Log in to www.vinimai.com</li>
                  <li>Go to the "My Orders" section</li>
                  <li>Select the relevant order</li>
                  <li>Click on "Return" and follow the instructions, a reverse pickup will be arranged</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Refunds are initiated after the returned item passes the quality inspection</li>
                  <li>Refunds will be processed to your original mode of payment or can be issued as store credit, depending on your preference</li>
                  <li><strong>Refund Timeline:</strong> 5-7 business days after product verification</li>
                  <li><strong>Return Charges:</strong> If the product is not faulty and the return is made by customer choice, a return fee will apply. The greater of Rs.100 or the delivery cost will be deducted from the total refund amount</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  For help or questions related to returns and refunds, reach out to: 
                  <a href="mailto:customercare@vinimai.com" className="text-blue-600 hover:text-blue-800 ml-1">
                    customercare@vinimai.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/track-orders">Track Your Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}