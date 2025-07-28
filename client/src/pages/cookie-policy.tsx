import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Cookie, Settings, Eye, BarChart3 } from "lucide-react";

export default function CookiePolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: June 22, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose max-w-none">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Cookie className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-orange-900 m-0">About Our Cookies</h2>
            </div>
            <p className="text-orange-800 m-0">
              This Cookie Policy explains how Vinimai ("we", "us", or "our") uses cookies and similar 
              technologies when you visit our website ViniMai.com. It explains what these technologies 
              are and why we use them, as well as your rights to control our use of them.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-blue-600" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Cookies are small data files that are placed on your computer or mobile device when you 
                  visit a website. Cookies are widely used by website owners to make their websites work, 
                  or to work more efficiently, as well as to provide reporting information.
                </p>
                <p className="text-gray-700">
                  Cookies set by the website owner (in this case, Vinimai) are called "first party cookies". 
                  Cookies set by parties other than the website owner are called "third party cookies". 
                  Third party cookies enable third party features or functionality to be provided on or 
                  through the website (e.g., advertising, interactive content, and analytics).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  Why Do We Use Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">We use cookies for several reasons:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Essential cookies:</strong> These are required for the website to function properly, such as keeping you logged in</li>
                  <li><strong>Performance cookies:</strong> These help us understand how visitors interact with our website by collecting anonymous information</li>
                  <li><strong>Functionality cookies:</strong> These remember your preferences and provide enhanced, personalized features</li>
                  <li><strong>Marketing cookies:</strong> These track your activity across websites to show you relevant advertisements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Strictly Necessary Cookies</h4>
                    <p className="text-gray-700 mb-2">
                      These cookies are essential for the website to function and cannot be switched off. 
                      They are usually only set in response to actions made by you, such as logging in 
                      or filling in forms.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <p className="text-sm text-gray-600">Examples: Session management, authentication, security features</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Cookies</h4>
                    <p className="text-gray-700 mb-2">
                      These cookies collect information about how visitors use our website, such as which 
                      pages visitors go to most often. This information helps us improve how our website works.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <p className="text-sm text-gray-600">Examples: Google Analytics, page load times, error reporting</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h4>
                    <p className="text-gray-700 mb-2">
                      These cookies allow the website to remember choices you make and provide enhanced, 
                      more personal features.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <p className="text-sm text-gray-600">Examples: Language preferences, location settings, personalized content</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                    <p className="text-gray-700 mb-2">
                      These cookies track your activity across different websites to show you relevant 
                      advertisements and measure the effectiveness of advertising campaigns.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <p className="text-sm text-gray-600">Examples: Social media tracking, advertising networks, retargeting</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">We use the following third-party services that may set cookies:</p>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      We use Google Analytics to understand how visitors interact with our website. 
                      This helps us improve user experience.
                    </p>
                    <p className="text-xs text-gray-500">
                      Learn more: <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Google Privacy Policy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Processing</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Our payment processor (Razorpay) may set cookies to facilitate secure transactions 
                      and prevent fraud.
                    </p>
                    <p className="text-xs text-gray-500">
                      Learn more: <a href="https://razorpay.com/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Razorpay Privacy Policy</a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Social media plugins may set cookies when you interact with social sharing features 
                      or embedded content.
                    </p>
                    <p className="text-xs text-gray-500">
                      Policies vary by platform (Facebook, Twitter, Instagram, etc.)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Control Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Browser Settings</h4>
                    <p className="text-gray-700 mb-2">
                      Most web browsers allow you to control cookies through their settings preferences. 
                      You can usually find these settings in the "Options" or "Preferences" menu of your browser.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      <li>Block all cookies</li>
                      <li>Allow only first-party cookies</li>
                      <li>Delete cookies when you close your browser</li>
                      <li>Set exceptions for specific websites</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Opt-Out Tools</h4>
                    <p className="text-gray-700 mb-2">
                      You can opt out of certain third-party cookies using these tools:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                      <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Google Analytics Opt-out</a></li>
                      <li>Network Advertising Initiative: <a href="https://www.networkadvertising.org/choices/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">NAI Opt-out</a></li>
                      <li>Digital Advertising Alliance: <a href="https://www.aboutads.info/choices/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">DAA Opt-out</a></li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website. 
                      Some features may not work properly if essential cookies are blocked.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookie Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Different cookies have different retention periods:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-900">Session Cookies</span>
                    <span className="text-gray-600">Deleted when you close your browser</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-900">Persistent Cookies</span>
                    <span className="text-gray-600">30 days to 2 years (varies by purpose)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-900">Analytics Cookies</span>
                    <span className="text-gray-600">Up to 2 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any material 
                  changes by posting the new policy on this page with an updated effective date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> 
                    <a href="mailto:customercare@vinimai.com" className="text-blue-600 hover:underline ml-1">
                      customercare@vinimai.com
                    </a>
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Subject:</strong> Cookie Policy Inquiry
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                This Cookie Policy was last updated on June 22, 2025
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/privacy-policy">Privacy Policy</Link>
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