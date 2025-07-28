import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Users, Mail } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Effective Date: June 22, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900 m-0">Your Privacy Matters to Us</h2>
            </div>
            <p className="text-blue-800 m-0">
              Welcome to ViniMai.com. Your privacy is important to us. This Privacy Policy explains 
              how we collect, use, share, and protect your personal information when you use our platform 
              to buy and sell goods.
            </p>
            <p className="text-blue-800 mt-3 mb-0">
              By accessing or using ViniMai.com, you agree to the terms of this Privacy Policy.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  1. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">We collect the following categories of personal information:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Identity Information:</strong> Name, gender, email address, phone number, date of birth</li>
                  <li><strong>Address Details:</strong> Shipping and billing addresses</li>
                  <li><strong>Transaction Data:</strong> Records of products bought or sold</li>
                  <li><strong>Usage Data:</strong> Pages visited, actions taken on the site</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Location Data:</strong> Approximate geographic location</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  2. How We Collect Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">Your personal information is collected directly from you when you:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Create an account on the Website</li>
                  <li>List or purchase a product</li>
                  <li>Subscribe to our marketing updates</li>
                  <li>Interact with our customer service</li>
                  <li>Navigate through the website (automated tracking tools)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  3. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Process and deliver orders</li>
                  <li>Create and manage user accounts</li>
                  <li>Improve user experience on the platform</li>
                  <li>Communicate offers, promotions, and updates</li>
                  <li>Detect and prevent fraud or illegal activity</li>
                  <li>Comply with applicable laws, taxation, and auditing requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Third-Party Sharing & Disclosure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We do not sell your personal data. However, we may share your information with trusted 
                  third parties only for operational or legal purposes, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Payment processors (for secure transactions)</li>
                  <li>Delivery/logistics partners (to fulfill orders)</li>
                  <li>Marketing service providers (to send communications and promotions)</li>
                  <li>Government authorities (if required under law, regulation, or legal process)</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Each partner is contractually obligated to handle your data securely and only for 
                  the purpose it is shared.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. User Rights Under DPDP Act, 2023</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  As per the Digital Personal Data Protection Act, 2023, you have the following rights:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Right to access your personal data held by us</li>
                  <li>Right to request correction of inaccurate or incomplete data</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise your rights or raise a privacy concern, you can contact us at 
                  <a href="mailto:customercare@vinimai.com" className="text-blue-600 hover:underline ml-1">
                    customercare@vinimai.com
                  </a>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We use cookies and other technologies to enhance user experience and track usage. 
                  You may disable cookies through your browser settings, although this may impact functionality.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We use industry-standard security measures including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>SSL encryption</li>
                  <li>Role-based data access</li>
                  <li>Secure third-party integrations</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  These measures protect your personal information from unauthorized access, alteration, or disclosure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We retain your personal data as long as your account is active or as required to 
                  fulfill legal obligations, enforce policies, or resolve disputes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Vinimai.com reserves all rights to make changes in the current policy without any 
                  prior notice which will require no other agreement. Continued use of ViniMai.com 
                  after changes are posted will constitute your acceptance of those changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  10. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have any questions or concerns regarding this Privacy Policy or your personal data, please contact:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 font-medium">
                    Email: 
                    <a href="mailto:customercare@vinimai.com" className="text-blue-600 hover:underline ml-1">
                      customercare@vinimai.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                Last updated: June 22, 2025
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
    </div>
  );
}