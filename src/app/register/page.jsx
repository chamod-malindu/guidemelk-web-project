"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, User, MapPin } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import GoogleAuthButton from "@/components/GoogleAuthButton"

export default function RegisterPage() {
  const [selectedUserType, setSelectedUserType] = useState("")

  const handleEmailSignup = () => {
    if (selectedUserType) {
      window.location.href = `/register/form?type=${selectedUserType}`
    }
  }

  const handleGoogleSignup = () => {
    if (selectedUserType) {
      // Handle Google OAuth signup
      console.log(`Google signup for ${selectedUserType}`)
      // Redirect to Google OAuth with user type parameter
      window.location.href = `/auth/google?type=${selectedUserType}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Navbar />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join GuideMeLK</h1>
          <p className="text-gray-600">Create your account and start exploring Sri Lanka</p>
        </div>

        {/* User Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Choose Your Role</CardTitle>
            <CardDescription className="text-center">Select how you want to use GuidMeLK</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedUserType === "tourist" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedUserType("tourist")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    selectedUserType === "tourist" ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Join as Tourist</h3>
                  <p className="text-sm text-gray-600">Discover amazing local guides</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedUserType === "tourist" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {selectedUserType === "tourist" && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedUserType === "guide" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedUserType("guide")}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    selectedUserType === "guide" ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Join as Guide</h3>
                  <p className="text-sm text-gray-600">Share your local expertise</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedUserType === "guide" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {selectedUserType === "guide" && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signup Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">Choose your preferred signup method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full h-12" onClick={handleEmailSignup} disabled={!selectedUserType}>
              <Mail className="mr-2 h-5 w-5" />
              Continue with Email
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <GoogleAuthButton userRole={selectedUserType} disabled={!selectedUserType} />

            {!selectedUserType && <p className="text-sm text-center text-red-500">Please select your role first</p>}
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
