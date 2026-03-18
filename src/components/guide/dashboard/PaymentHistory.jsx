"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, Package, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PaymentHistory({
  loadingPayments,
  paymentError,
  paymentHistory,
  setActiveTab,
  router,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Payment History
            </CardTitle>
            <CardDescription>
              Track all your earnings and payments
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Loading */}
        {loadingPayments && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment history...</p>
          </div>
        )}

        {/* Error */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-medium mb-2">
              Error Loading Payments
            </p>
            <p className="text-red-500 text-sm mb-4">{paymentError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No Payments */}
        {!loadingPayments && !paymentError && paymentHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Payments Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Your payment history will appear here once you start receiving
              payments from bookings.
            </p>
            <Button onClick={() => setActiveTab("bookings")}>
              <Package className="h-4 w-4 mr-2" />
              View Bookings
            </Button>
          </div>
        )}

        {/* Payment Table */}
        {!loadingPayments && !paymentError && paymentHistory.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Tourist
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Commission
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Net Earnings
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Method
                  </th>
                </tr>
              </thead>

              <tbody>
                {paymentHistory.map((payment, index) => (
                  <tr
                    key={payment._id || payment.id || index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleTimeString()}
                      </div>
                    </td>

                    {/* Tourist */}
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage
                            src={payment.tourist?.profileImage || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {(payment.tourist?.firstName?.[0] || "") +
                              (payment.tourist?.lastName?.[0] || "")}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.tourist?.firstName}{" "}
                            {payment.tourist?.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {payment.tourist?._id?.slice(-6) || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </div>
                    </td>

                    {/* Commission */}
                    <td className="py-4 px-4">
                      <div className="text-sm text-red-600">
                        -${payment.commission?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.commission
                          ? (
                              (payment.commission / payment.amount) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </td>

                    {/* Net Earnings */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-bold text-green-600">
                        ${payment.netEarnings.toFixed(2)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : payment.status === "pending"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>

                    {/* Method */}
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {payment.method}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
