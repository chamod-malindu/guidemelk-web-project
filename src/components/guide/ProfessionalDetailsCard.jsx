"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfessionalDetailsCard({ formValues, handleChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="languages">Languages</Label>
            <Input id="languages" value={formValues.languages} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input id="experience" type="number" value={formValues.experience} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="pricePerDay">Price per Day (USD)</Label>
            <Input id="pricePerDay" type="number" value={formValues.pricePerDay} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label htmlFor="specialties">Tour Specialties</Label>
          <Input id="specialties" value={formValues.specialties} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} value={formValues.bio} onChange={handleChange} />
        </div>
      </CardContent>
    </Card>
  );
}
