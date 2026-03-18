"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function EarningsSummary({ earnings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* This Month */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-blue-600">
                ${earnings.thisMonth.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center text-xs text-gray-600">
              <span className="text-green-600 mr-1">↗</span>
              <span>
                +
                {earnings.thisMonth > earnings.lastMonth
                  ? (
                      ((earnings.thisMonth - earnings.lastMonth) /
                        Math.max(earnings.lastMonth, 1)) *
                      100
                    ).toFixed(0)
                  : 0}
                % from last month
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Month */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Month</p>
              <p className="text-3xl font-bold text-gray-900">
                ${earnings.lastMonth.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-full">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </div>

          <div className="mt-4">
            <Progress
              value={
                earnings.lastMonth > 0
                  ? (earnings.lastMonth / Math.max(earnings.totalEarnings, 1)) *
                    100
                  : 0
              }
              className="h-2"
            />
            <p className="text-xs text-gray-600 mt-2">Previous period earnings</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Earnings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600">
                ${earnings.totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="mt-4">
            <Progress value={100} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">All-time earnings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
