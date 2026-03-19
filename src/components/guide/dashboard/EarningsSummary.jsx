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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${earnings.thisMonth.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span className="text-green-600 dark:text-green-400 mr-1">↗</span>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${earnings.lastMonth.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-full">
              <Calendar className="h-6 w-6 text-gray-600 dark:text-gray-400" />
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
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Previous period earnings</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Earnings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${earnings.totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="mt-4">
            <Progress value={100} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">All-time earnings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
