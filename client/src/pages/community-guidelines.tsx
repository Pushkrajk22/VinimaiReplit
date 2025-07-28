import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Shield, Users, AlertTriangle, CheckCircle, Heart } from "lucide-react";

export default function CommunityGuidelines() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Guidelines</h1>
          <p className="text-gray-600">Building a safe and trusted marketplace for everyone</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900 m-0">Welcome to Vinimai Community</h2>
            </div>
            <p className="text-blue-800 m-0">
              Our community thrives on trust, respect, and honest transactions. These guidelines help ensure 
              a positive experience for all buyers and sellers on our platform.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What We Encourage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Honest Product Descriptions</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Provide accurate and detailed product descriptions</li>
                    <li>Upload clear, recent photos showing the actual item condition</li>
                    <li>Mention any defects, wear, or damage honestly</li>
                    <li>Set fair and reasonable prices</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Respectful Communication</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Be polite and professional in all interactions</li>
                    <li>Respond to messages and offers promptly</li>
                    <li>Negotiate fairly and in good faith</li>
                    <li>Use clear, understandable language</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Safe Trading Practices</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Complete all transactions through the Vinimai platform</li>
                    <li>Use our secure payment system</li>
                    <li>Meet in safe, public locations for in-person exchanges</li>
                    <li>Keep communication within the platform</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Fraudulent Behavior</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Creating fake accounts or using false identity</li>
                    <li>Posting misleading or false product information</li>
                    <li>Attempting to complete transactions outside the platform</li>
                    <li>Using stolen or manipulated photos</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Inappropriate Content</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Adult content or services</li>
                    <li>Illegal items or substances</li>
                    <li>Counterfeit or pirated goods</li>
                    <li>Weapons, explosives, or dangerous items</li>
                    <li>Hate speech or discriminatory content</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Disruptive Behavior</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Harassment, bullying, or threats</li>
                    <li>Spam or excessive messaging</li>
                    <li>Price manipulation or bid sniping</li>
                    <li>Creating multiple accounts to circumvent restrictions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Reporting and Enforcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">How to Report Issues</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Use the "Report" button on any listing or user profile</li>
                    <li>Contact our support team at customercare@vinimai.com</li>
                    <li>Provide detailed information about the issue</li>
                    <li>Include screenshots or evidence when possible</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Consequences for Violations</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>Warning:</strong> For minor first-time violations</li>
                    <li><strong>Temporary Suspension:</strong> For repeated or serious violations</li>
                    <li><strong>Permanent Ban:</strong> For severe violations or repeated offenses</li>
                    <li><strong>Legal Action:</strong> For illegal activities or fraud</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Building Trust
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">User Verification</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>All users must verify their mobile number via OTP</li>
                    <li>Complete your profile with accurate information</li>
                    <li>Build your reputation through successful transactions</li>
                    <li>Maintain high ratings and positive feedback</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Rating System</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Rate your experience after each transaction</li>
                    <li>Provide honest and constructive feedback</li>
                    <li>Help others make informed decisions</li>
                    <li>Report any attempts to manipulate ratings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have questions about these guidelines or need to report an issue:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> customercare@vinimai.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Response Time:</strong> Within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              These guidelines are updated periodically. Last updated: June 22, 2025
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}