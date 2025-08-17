import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken } from '@/lib/auth';

// UPDATE booking status
export async function PUT(request, { params }) {
  try {
    const { bookingId } = params;
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Parse request body
    const body = await request.json();
    const { action, declineReason, notes } = body;

    // Validate action
    const validActions = ['accept', 'decline', 'complete', 'cancel', 'pay-advance', 'pay-remaining'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action specified" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the booking
    const booking = await Booking.findById(bookingId).populate([
      {
        path: 'tourist',
        select: 'firstName lastName email'
      },
      {
        path: 'guide',
        select: 'firstName lastName email'
      }
    ]);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Authorization check
    const isGuide = decoded.userId === booking.guide._id.toString();
    const isTourist = decoded.userId === booking.tourist._id.toString();
    const isAdmin = decoded.role === 'admin';

    if (!isGuide && !isTourist && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized to modify this booking" },
        { status: 403 }
      );
    }

    // Handle different actions
    let updateData = {};
    let statusMessage = "";

    switch (action) {
      case 'accept':
        // Only guides can accept bookings
        if (!isGuide) {
          return NextResponse.json(
            { error: "Only guides can accept bookings" },
            { status: 403 }
          );
        }
        
        if (booking.status !== 'pending') {
          return NextResponse.json(
            { error: "Only pending bookings can be accepted" },
            { status: 400 }
          );
        }

        updateData.status = 'confirmed';
        booking.updateProcessStep('Under Review', true);
        booking.updateProcessStep('Confirmed', true);
        statusMessage = "Booking accepted successfully!";
        break;

      case 'decline':
        // Only guides can decline bookings
        if (!isGuide) {
          return NextResponse.json(
            { error: "Only guides can decline bookings" },
            { status: 403 }
          );
        }
        
        if (booking.status !== 'pending') {
          return NextResponse.json(
            { error: "Only pending bookings can be declined" },
            { status: 400 }
          );
        }

        if (!declineReason) {
          return NextResponse.json(
            { error: "Decline reason is required" },
            { status: 400 }
          );
        }

        updateData.status = 'declined';
        updateData.declineReason = declineReason;
        statusMessage = "Booking declined";
        break;

        case 'complete':
          // Only guides can mark bookings as complete
          if (!isGuide) {
            return NextResponse.json(
              { error: "Only guides can complete bookings" },
              { status: 403 }
            );
          }
          
          if (booking.status !== 'confirmed') {
            return NextResponse.json(
              { error: "Only confirmed bookings can be completed" },
              { status: 400 }
            );
          }
        
          // Check if the tour date has passed
          const today = new Date();
          if (booking.date > today) {
            return NextResponse.json(
              { error: "Cannot complete booking before tour date" },
              { status: 400 }
            );
          }
        
          updateData.status = 'completed';
          updateData.completedAt = new Date();
        
          booking.updateProcessStep('Tour Completed', true);
        
          if (booking.paymentStatus === 'processed') {
            booking.updateProcessStep('Payment Processed', true);
          }
        
          statusMessage = "Booking marked as completed! Waiting for final payment from tourist if any.";
          break;
        

      case 'cancel':
        // Both tourists and guides can cancel bookings
        if (!isTourist && !isGuide) {
          return NextResponse.json(
            { error: "Only tourists or guides can cancel bookings" },
            { status: 403 }
          );
        }
        
        if (!['pending', 'confirmed'].includes(booking.status)) {
          return NextResponse.json(
            { error: "Only pending or confirmed bookings can be cancelled" },
            { status: 400 }
          );
        }

        // Check cancellation time restrictions (24 hours before)
        const timeDiff = booking.date - new Date();
        const hoursUntilTour = timeDiff / (1000 * 60 * 60);
        
        if (hoursUntilTour < 24) {
          return NextResponse.json(
            { error: "Cannot cancel booking less than 24 hours before tour" },
            { status: 400 }
          );
        }

        updateData.status = 'cancelled';
        updateData.cancelledAt = new Date();
        statusMessage = "Booking cancelled successfully";
        break;

      case 'pay-advance':
        if (!isTourist) {
          return NextResponse.json({ error: "Only tourists can pay advance" }, { status: 403 });
        }
        if (booking.status !== 'confirmed') {
          return NextResponse.json({ error: "Advance can only be paid after booking is confirmed" }, { status: 400 });
        }

        const advAmount = body.advanceAmount || booking.totalCost * 0.2;
        booking.advanceAmount = advAmount;
        booking.advancePaidAt = new Date();
        booking.paymentTransactionId = body.paymentTransactionId || `TXN-ADV-${Date.now()}`;

        // Mark partial payment
        booking.paymentStatus = 'partial';

        statusMessage = `Advance payment of $${advAmount} recorded successfully`;
        break;

      case 'pay-remaining':
        if (!isTourist) {
          return NextResponse.json({ error: "Only tourists can pay remaining balance" }, { status: 403 });
        }
        if (booking.status !== 'completed') {
          return NextResponse.json({ error: "Remaining payment can only be made after tour is completed" }, { status: 400 });
        }
        const remainingToPay = booking.totalCost - (booking.advanceAmount || 0);
        if (remainingToPay <= 0) {
          return NextResponse.json({ error: "No remaining balance to pay" }, { status: 400 });
        }

        booking.remainingAmount = remainingToPay;
        booking.remainingPaidAt = new Date();
        booking.remainingPaymentTransactionId = body.paymentTransactionId || `TXN-REM-${Date.now()}`;

        // Mark full payment complete
        booking.paymentStatus = 'processed';
        booking.updateProcessStep('Payment Processed', true);

        statusMessage = `Remaining payment of $${remainingToPay} recorded successfully`;
        break;
  

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    // Update the booking
    Object.assign(booking, updateData);
    await booking.save();

    console.log(`✅ Booking ${bookingId} ${action}ed by user ${decoded.userId}`);

    return NextResponse.json({
      success: true,
      message: statusMessage,
      booking
    });

  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: "Failed to update booking. Please try again." },
      { status: 500 }
    );
  }
}

// GET single booking details
export async function GET(request, { params }) {
  try {
    const { bookingId } = params;
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Connect to database
    await dbConnect();

    // Find the booking with populated data
    const booking = await Booking.findById(bookingId).populate([
      {
        path: 'tourist',
        select: 'firstName lastName profileImage email phone country'
      },
      {
        path: 'guide',
        select: 'firstName lastName profileImage email phone location languages experience'
      }
    ]);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Authorization check
    const isGuide = decoded.userId === booking.guide._id.toString();
    const isTourist = decoded.userId === booking.tourist._id.toString();
    const isAdmin = decoded.role === 'admin';

    if (!isGuide && !isTourist && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized to view this booking" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return NextResponse.json(
      { error: "Failed to fetch booking details" },
      { status: 500 }
    );
  }
}

// DELETE booking (for admin or cancellation)
export async function DELETE(request, { params }) {
  try {
    const { bookingId } = params;
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Only admin can delete bookings
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Only administrators can delete bookings" },
        { status: 403 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find and delete the booking
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Booking ${bookingId} deleted by admin ${decoded.userId}`);

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully"
    });

  } catch (error) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}