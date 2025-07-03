"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function RegisterFormPage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "tourist"

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Tourist form state
  const [touristForm, setTouristForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
  })

  // Guide form state
  const [guideForm, setGuideForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    languages: "",
    specialties: "",
    experience: "",
    pricePerDay: "",
    bio: "",
  })

  // Validation functions
  const validateTouristForm = () => {
    const newErrors = {}
    
    if (!touristForm.firstName.trim()) newErrors.firstName = "First name is required"
    if (!touristForm.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!touristForm.email.trim()) newErrors.email = "Email is required"
    if (!touristForm.password) newErrors.password = "Password is required"
    if (touristForm.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (touristForm.password !== touristForm.confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    if (!touristForm.phone.trim()) newErrors.phone = "Phone number is required"
    if (!touristForm.country.trim()) newErrors.country = "Country is required"
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (touristForm.email && !emailRegex.test(touristForm.email)) {
      newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateGuideForm = () => {
    const newErrors = {}
    
    if (!guideForm.firstName.trim()) newErrors.firstName = "First name is required"
    if (!guideForm.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!guideForm.email.trim()) newErrors.email = "Email is required"
    if (!guideForm.password) newErrors.password = "Password is required"
    if (guideForm.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (guideForm.password !== guideForm.confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    if (!guideForm.phone.trim()) newErrors.phone = "Phone number is required"
    if (!guideForm.location.trim()) newErrors.location = "Location is required"
    if (!guideForm.languages.trim()) newErrors.languages = "Languages are required"
    if (!guideForm.specialties.trim()) newErrors.specialties = "Specialties are required"
    if (!guideForm.experience) newErrors.experience = "Experience is required"
    if (!guideForm.pricePerDay) newErrors.pricePerDay = "Price per day is required"
    if (!guideForm.bio.trim()) newErrors.bio = "Bio is required"
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (guideForm.email && !emailRegex.test(guideForm.email)) {
      newErrors.email = "Invalid email format"
    }

    if (guideForm.experience && (isNaN(guideForm.experience) || guideForm.experience < 0)) {
      newErrors.experience = "Experience must be a valid number"
    }

    if (guideForm.pricePerDay && (isNaN(guideForm.pricePerDay) || guideForm.pricePerDay < 0)) {
      newErrors.pricePerDay = "Price must be a valid number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTouristRegister = async () => {
    if (!validateTouristForm()) return
    if (!acceptTerms) {
      alert("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: touristForm.firstName.trim(),
          lastName: touristForm.lastName.trim(),
          email: touristForm.email.trim(),
          password: touristForm.password,
          role: 'tourist',
          country: touristForm.country.trim(),
          phone: touristForm.phone.trim()
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Registration successful! Please check your email for verification.')
        window.location.href = "/verify-email"
      } else {
        if (data.error) {
          alert(data.error)
        } else {
          alert('Registration failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuideRegister = async () => {
    if (!validateGuideForm()) return
    if (!acceptTerms) {
      alert("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: guideForm.firstName.trim(),
          lastName: guideForm.lastName.trim(),
          email: guideForm.email.trim(),
          password: guideForm.password,
          role: 'guide',
          location: guideForm.location.trim(),
          languages: guideForm.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
          specialties: guideForm.specialties.split(',').map(spec => spec.trim()).filter(spec => spec),
          experience: parseInt(guideForm.experience) || 0,
          pricePerDay: parseFloat(guideForm.pricePerDay) || 0,
          bio: guideForm.bio.trim(),
          phone: guideForm.phone.trim()
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Registration successful! Please check your email for verification.')
        window.location.href = "/verify-email"
      } else {
        if (data.error) {
          alert(data.error)
        } else {
          alert('Registration failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if no user type is specified
  useEffect(() => {
    if (!userType || (userType !== "tourist" && userType !== "guide")) {
      window.location.href = "/register"
    }
  }, [userType])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Navbar />
          </div>
          <div className="flex items-center justify-center mb-4">
            <Link href="/register" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userType === "tourist" ? "Join as Tourist" : "Join as Guide"}
              </h1>
              <p className="text-gray-600">
                {userType === "tourist"
                  ? "Start discovering amazing local guides across Sri Lanka"
                  : "Join our community of local guides and start earning"}
              </p>
            </div>
          </div>
        </div>

        {/* Tourist Registration Form */}
        {userType === "tourist" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Tourist Account</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tourist-firstName">First Name</Label>
                  <Input
                    id="tourist-firstName"
                    placeholder="Enter your first name"
                    value={touristForm.firstName}
                    onChange={(e) => setTouristForm({ ...touristForm, firstName: e.target.value })}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="tourist-lastName">Last Name</Label>
                  <Input
                    id="tourist-lastName"
                    placeholder="Enter your last name"
                    value={touristForm.lastName}
                    onChange={(e) => setTouristForm({ ...touristForm, lastName: e.target.value })}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="tourist-email">Email</Label>
                <Input
                  id="tourist-email"
                  type="email"
                  placeholder="Enter your email"
                  value={touristForm.email}
                  onChange={(e) => setTouristForm({ ...touristForm, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="tourist-phone">Phone Number</Label>
                <Input
                  id="tourist-phone"
                  placeholder="Enter your phone number"
                  value={touristForm.phone}
                  onChange={(e) => setTouristForm({ ...touristForm, phone: e.target.value })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="tourist-country">Country</Label>
                <Input
                  id="tourist-country"
                  placeholder="Enter your country"
                  value={touristForm.country}
                  onChange={(e) => setTouristForm({ ...touristForm, country: e.target.value })}
                  className={errors.country ? "border-red-500" : ""}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              <div>
                <Label htmlFor="tourist-password">Password</Label>
                <div className="relative">
                  <Input
                    id="tourist-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={touristForm.password}
                    onChange={(e) => setTouristForm({ ...touristForm, password: e.target.value })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="tourist-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="tourist-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={touristForm.confirmPassword}
                    onChange={(e) => setTouristForm({ ...touristForm, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                className="w-full" 
                onClick={handleTouristRegister} 
                disabled={!acceptTerms || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Tourist Account"
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guide Registration Form */}
        {userType === "guide" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Guide Account</CardTitle>
              <CardDescription>Fill in your details to start guiding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guide-firstName">First Name</Label>
                  <Input
                    id="guide-firstName"
                    placeholder="Enter your first name"
                    value={guideForm.firstName}
                    onChange={(e) => setGuideForm({ ...guideForm, firstName: e.target.value })}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="guide-lastName">Last Name</Label>
                  <Input
                    id="guide-lastName"
                    placeholder="Enter your last name"
                    value={guideForm.lastName}
                    onChange={(e) => setGuideForm({ ...guideForm, lastName: e.target.value })}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="guide-email">Email</Label>
                <Input
                  id="guide-email"
                  type="email"
                  placeholder="Enter your email"
                  value={guideForm.email}
                  onChange={(e) => setGuideForm({ ...guideForm, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="guide-phone">Phone Number</Label>
                <Input
                  id="guide-phone"
                  placeholder="Enter your phone number"
                  value={guideForm.phone}
                  onChange={(e) => setGuideForm({ ...guideForm, phone: e.target.value })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="guide-location">Location</Label>
                <Input
                  id="guide-location"
                  placeholder="e.g., Kandy, Sri Lanka"
                  value={guideForm.location}
                  onChange={(e) => setGuideForm({ ...guideForm, location: e.target.value })}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guide-languages">Languages</Label>
                  <Input
                    id="guide-languages"
                    placeholder="e.g., English, Sinhala"
                    value={guideForm.languages}
                    onChange={(e) => setGuideForm({ ...guideForm, languages: e.target.value })}
                    className={errors.languages ? "border-red-500" : ""}
                  />
                  {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
                </div>
                <div>
                  <Label htmlFor="guide-experience">Years of Experience</Label>
                  <Input
                    id="guide-experience"
                    type="number"
                    placeholder="e.g., 5"
                    value={guideForm.experience}
                    onChange={(e) => setGuideForm({ ...guideForm, experience: e.target.value })}
                    className={errors.experience ? "border-red-500" : ""}
                  />
                  {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guide-specialties">Tour Specialties</Label>
                  <Input
                    id="guide-specialties"
                    placeholder="e.g., Cultural, Nature"
                    value={guideForm.specialties}
                    onChange={(e) => setGuideForm({ ...guideForm, specialties: e.target.value })}
                    className={errors.specialties ? "border-red-500" : ""}
                  />
                  {errors.specialties && <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>}
                </div>
                <div>
                  <Label htmlFor="guide-pricePerDay">Price per Day (USD)</Label>
                  <Input
                    id="guide-pricePerDay"
                    type="number"
                    placeholder="e.g., 75"
                    value={guideForm.pricePerDay}
                    onChange={(e) => setGuideForm({ ...guideForm, pricePerDay: e.target.value })}
                    className={errors.pricePerDay ? "border-red-500" : ""}
                  />
                  {errors.pricePerDay && <p className="text-red-500 text-sm mt-1">{errors.pricePerDay}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="guide-bio">Bio</Label>
                <Textarea
                  id="guide-bio"
                  placeholder="Tell tourists about yourself, your experience, and what makes your tours special..."
                  value={guideForm.bio}
                  onChange={(e) => setGuideForm({ ...guideForm, bio: e.target.value })}
                  rows={3}
                  className={errors.bio ? "border-red-500" : ""}
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div>
                <Label htmlFor="guide-password">Password</Label>
                <div className="relative">
                  <Input
                    id="guide-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={guideForm.password}
                    onChange={(e) => setGuideForm({ ...guideForm, password: e.target.value })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="guide-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="guide-confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={guideForm.confirmPassword}
                    onChange={(e) => setGuideForm({ ...guideForm, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="guide-terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
                <Label htmlFor="guide-terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                className="w-full" 
                onClick={handleGuideRegister} 
                disabled={!acceptTerms || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Guide Account"
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}