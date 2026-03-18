import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AvailabilityCalendar() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Availability Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">January 2024</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`text-center py-2 text-sm cursor-pointer rounded-lg ${
                day % 7 === 0 || day % 7 === 6
                  ? "bg-red-50 text-red-600"
                  : day % 3 === 0
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
            <span>Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}