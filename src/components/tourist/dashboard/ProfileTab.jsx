"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileTab({
  user,
  formData,
  photoPreview,
  fileInputRef,
  isEditing,
  loggingOut,
  setFormData,
  handleEditToggle,
  handlePhotoChange,
  handleLogout,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Profile Settings
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Avatar + File Upload */}
          <div className="flex items-center mb-4 gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={photoPreview || user.profileImage || "/placeholder.svg"}
              />
              <AvatarFallback>
                {user.firstName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={!isEditing}
              className="block"
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={formData.email} disabled />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          {/* Country */}
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="mt-2 flex items-center gap-2">
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleEditToggle}
        >
          {isEditing ? "Save Changes" : "Update Profile"}
        </Button>

        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "Log Out"}
        </Button>
      </div>
    </div>
  );
}
