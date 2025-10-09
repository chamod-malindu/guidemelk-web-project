import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CreditCard, Building, CheckCircle, Loader } from "lucide-react";

  

  const PaymentModal = ({ isOpen, onClose, booking, paymentType, onSuccess, touristId }) => {
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
      // Card details
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      // Bank transfer details
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountHolder: '',
      // PayPal 
      paypalEmail: ''
    });
  

  // Add null check for booking before calculating amount
  const amount = booking ? (
    paymentType === 'advance' 
      ? booking.totalCost * 0.2 
      : booking.totalCost - (booking.advanceAmount || 0)
  ) : 0;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Add booking check before processing
    if (!booking) {
      alert("Booking information is missing. Please try again.");
      return;
    }
  
    setProcessing(true);
  
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    try {
      // 1. Update the booking (your existing logic)
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: paymentType === "advance" ? "pay-advance" : "pay-remaining",
          advanceAmount: paymentType === "advance" ? amount : undefined,
          paymentMethod: selectedMethod,
          paymentDetails: formData,
        }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      console.log("DEBUG PaymentModal payment POST", {
        touristId,
        booking,
        postBody: {
          guide: booking.guide?._id || booking.guide?.id,
          tourist: touristId,
          booking: booking._id,
          date: new Date(),
          amount: amount,
          commission: 0,
          netEarnings: amount,
          status: "completed",
          method: selectedMethod,
          transactionId: "",
          currency: "USD",
        },
      });
  
      // 2. ***NEW: Save payment record to MongoDB via /api/payments***
      // You can customize commission/netEarnings logic if needed
      try {
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guide: booking.guide?._id || booking.guide?.id,
            tourist: touristId,
            booking: booking._id,
            date: new Date(),
            amount: amount,
            commission: 0, 
            netEarnings: amount, 
            status: "completed",
            method: selectedMethod,
            transactionId: "", 
            currency: "USD", 
          }),
        });
      } catch (payErr) {
        // Optional: Log, show warning, but do not block main payment flow
        console.error("Payment record creation failed:", payErr);
      }
  
      // 3. Continue with success UI
      setSuccess(true);
      setTimeout(() => {
        onSuccess(data);
        onClose();
        setSuccess(false);
        setProcessing(false);
      }, 1500);
    } catch (err) {
      setProcessing(false);
      alert(`Payment failed: ${err.message}`);
    }
  };
  

  // Return null if modal is not open or booking is null
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden">
        
        {/* Success State */}
        {success && (
          <div className="p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-3">Payment Successful!</h3>
            <p className="text-gray-600 text-lg">Your payment has been processed successfully.</p>
          </div>
        )}

        {/* Payment Form */}
        {!success && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {paymentType === 'advance' ? 'Pay Advance' : 'Pay Remaining Balance'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {paymentType === 'advance' ? 'Secure your booking with 20% advance payment' : 'Complete your payment'}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Payment Amount Section */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="text-center">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {paymentType === 'advance' ? 'Advance Payment (20%)' : 'Remaining Balance'}
                  </span>
                </div>
                <div className="text-4xl font-bold mb-2">${amount.toFixed(2)}</div>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {booking.guide?.firstName?.[0]}{booking.guide?.lastName?.[0]}
                    </span>
                  </div>
                  <span className="text-sm">
                    Guide: {booking.guide?.firstName} {booking.guide?.lastName}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {/* Payment Methods */}
              <div className="p-6 border-b border-gray-100">
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Choose Payment Method
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={selectedMethod === 'card' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedMethod('card')}
                    className="flex flex-col items-center p-4 h-20 transition-all duration-200 hover:scale-105"
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Card</span>
                  </Button>
                  <Button
                    variant={selectedMethod === 'bank' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedMethod('bank')}
                    className="flex flex-col items-center p-4 h-20 transition-all duration-200 hover:scale-105"
                  >
                    <Building className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </Button>
                  <Button
                    variant={selectedMethod === 'paypal' ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedMethod('paypal')}
                    className="flex flex-col items-center p-4 h-20 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-6 h-6 mb-2 bg-blue-600 rounded-sm text-white flex items-center justify-center text-sm font-bold">
                      P
                    </div>
                    <span className="text-sm font-medium">PayPal</span>
                  </Button>
                </div>
              </div>

              {/* Payment Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Credit/Debit Card Form */}
                  {selectedMethod === 'card' && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                          Card Number
                        </Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formatCardNumber(formData.cardNumber)}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                          maxLength="19"
                          required
                          className="h-12 text-lg font-mono tracking-wider"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                            Expiry Date
                          </Label>
                          <Input
                            id="expiryDate"
                            type="text"
                            placeholder="MM/YY"
                            value={formatExpiryDate(formData.expiryDate)}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            maxLength="5"
                            required
                            className="h-12 text-center font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                            CVV
                          </Label>
                          <Input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            maxLength="4"
                            required
                            className="h-12 text-center font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName" className="text-sm font-medium text-gray-700">
                          Cardholder Name
                        </Label>
                        <Input
                          id="cardName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          required
                          className="h-12 uppercase"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Form */}
                  {selectedMethod === 'bank' && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">
                          Bank Name
                        </Label>
                        <Input
                          id="bankName"
                          type="text"
                          placeholder="Bank of America"
                          value={formData.bankName}
                          onChange={(e) => handleInputChange('bankName', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                          Account Number
                        </Label>
                        <Input
                          id="accountNumber"
                          type="text"
                          placeholder="1234567890"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                          required
                          className="h-12 font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routingNumber" className="text-sm font-medium text-gray-700">
                          Routing Number
                        </Label>
                        <Input
                          id="routingNumber"
                          type="text"
                          placeholder="123456789"
                          value={formData.routingNumber}
                          onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                          required
                          className="h-12 font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountHolder" className="text-sm font-medium text-gray-700">
                          Account Holder Name
                        </Label>
                        <Input
                          id="accountHolder"
                          type="text"
                          placeholder="John Doe"
                          value={formData.accountHolder}
                          onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                  )}

                  {/* PayPal Form */}
                  {selectedMethod === 'paypal' && (
                    <div className="space-y-5">
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">PayPal Secure Payment</h3>
                        <p className="text-sm text-blue-600">
                          You'll be redirected to PayPal to complete your payment securely with buyer protection.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paypalEmail" className="text-sm font-medium text-gray-700">
                          PayPal Email
                        </Label>
                        <Input
                          id="paypalEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.paypalEmail}
                          onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="w-5 h-5 bg-amber-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-amber-800 font-medium leading-relaxed">
                          We're not filling credit card info automatically because this form doesn't use a secure connection.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-green-700 font-medium leading-relaxed">
                          Your payment information is encrypted and secure with 256-bit SSL protection
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 h-12 text-base font-medium"
                      disabled={processing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={processing}
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <Loader className="animate-spin h-5 w-5" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        `Pay $${amount.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;