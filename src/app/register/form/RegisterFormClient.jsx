"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
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
import toast from "react-hot-toast"

// Sri Lankan districts data
const sriLankanDistricts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", 
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
  "Monaragala", "Ratnapura", "Kegalle"
]

// World languages data
const worldLanguages = [
  "English", "Sinhala", "Tamil", "Spanish", "French", "German", "Italian", 
  "Portuguese", "Russian", "Chinese (Mandarin)", "Japanese", "Korean", 
  "Arabic", "Hindi", "Dutch", "Swedish", "Norwegian", "Danish", "Finnish", 
  "Polish", "Czech", "Hungarian", "Greek", "Turkish", "Hebrew", "Thai", 
  "Vietnamese", "Indonesian", "Malay", "Swahili", "Romanian", "Bulgarian", 
  "Croatian", "Serbian", "Ukrainian", "Lithuanian", "Latvian", "Estonian"
]

// Tour specialties data
const tourSpecialties = [
  "Cultural Tours", "Historical Tours", "Nature Tours", "Adventure Tours", 
  "Food Tours", "Religious Tours", "Beach Tours", "Mountain Tours", 
  "Wildlife Tours", "Photography Tours", "Cycling Tours", "Hiking Tours", 
  "City Tours", "Village Tours", "Tea Plantation Tours", "Spice Garden Tours", 
  "Archaeological Tours", "Temple Tours", "Ayurveda Tours", "Surf Tours", 
  "Bird Watching", "Whale Watching", "Gem Mining Tours", "Train Journey Tours"
]

export default function RegisterFormClient() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "tourist";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Auth status:", status);
    console.log("Session user:", session?.user);
    
    // Redirect to appropriate dashboard if already signed in
    if (status === "authenticated" && session?.user?.usertype) {
      const role = session.user.usertype
      if (role === 'tourist') {
        router.push('/tourist');
      } else if (role === 'guide') {
        router.push('/guide/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push(`/${role}/dashboard`);
      }
    }
  }, [status, session, router])

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
      toast.error("Please accept the terms and conditions");
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
        toast.success('Registration successful! Please check your email for verification.', { duration: 3000 });
        setTimeout(() => {
          router.push('/verify-email');
        }, 3000);
      } else {
        if (data.error) {
          toast.error(data.error)
        } else {
          toast.error('Registration failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuideRegister = async () => {
    if (!validateGuideForm()) return
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions")
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
        toast.success('Registration successful! Please check your email for verification.', { duration: 3000 });
        setTimeout(() => {
          router.push('/verify-email');
        }, 3000);
      } else {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Redirect if no user type is specified
  useEffect(() => {
    if (!userType || (userType !== "tourist" && userType !== "guide")) {
     router.push("/register")
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
          <div className="relative flex items-center justify-center mb-4">
            <Link href="/register" className="absolute left-0">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="text-center">
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

              {/* Location Dropdown using native select */}
              <div>
                <Label htmlFor="guide-location">Location (District)</Label>
                <select
                  id="guide-location"
                  value={guideForm.location}
                  onChange={(e) => setGuideForm({ ...guideForm, location: e.target.value })}
                  className={`w-full h-10 px-3 py-2 text-sm bg-background border rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.location ? "border-red-500" : ""}`}
                >
                  <option value="">Select your district</option>
                  {sriLankanDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              {/* Languages with checkboxes */}
              <div>
                <Label>Languages (Select multiple)</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-md p-3">
                  {worldLanguages.map((language) => (
                    <label key={language} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        value={language}
                        checked={guideForm.languages.includes(language)}
                        onChange={(e) => {
                          const currentLangs = guideForm.languages.split(',').map(l => l.trim()).filter(l => l)
                          if (e.target.checked) {
                            const newLangs = [...currentLangs, language].join(', ')
                            setGuideForm({ ...guideForm, languages: newLangs })
                          } else {
                            const newLangs = currentLangs.filter(l => l !== language).join(', ')
                            setGuideForm({ ...guideForm, languages: newLangs })
                          }
                        }}
                        className="rounded"
                      />
                      <span>{language}</span>
                    </label>
                  ))}
                </div>
                {guideForm.languages && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {guideForm.languages}
                  </p>
                )}
                {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
              </div>

              {/* Specialties with checkboxes */}
              <div>
                <Label>Tour Specialties (Select multiple)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded-md p-3">
                  {tourSpecialties.map((specialty) => (
                    <label key={specialty} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        value={specialty}
                        checked={guideForm.specialties.includes(specialty)}
                        onChange={(e) => {
                          const currentSpecs = guideForm.specialties.split(',').map(s => s.trim()).filter(s => s)
                          if (e.target.checked) {
                            const newSpecs = [...currentSpecs, specialty].join(', ')
                            setGuideForm({ ...guideForm, specialties: newSpecs })
                          } else {
                            const newSpecs = currentSpecs.filter(s => s !== specialty).join(', ')
                            setGuideForm({ ...guideForm, specialties: newSpecs })
                          }
                        }}
                        className="rounded"
                      />
                      <span>{specialty}</span>
                    </label>
                  ))}
                </div>
                {guideForm.specialties && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {guideForm.specialties}
                  </p>
                )}
                {errors.specialties && <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
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