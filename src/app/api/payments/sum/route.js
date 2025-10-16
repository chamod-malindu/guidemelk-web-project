import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  // Parse the incoming request URL to extract query parameter
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const period = url.searchParams.get('period');

  const now = new Date();
  let dateFilter = {};

  // If the period filter is "thisMonth", build a date range for the first to last day of current month
  if (period === 'thisMonth') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    dateFilter = { $gte: first, $lte: last };
  }

  // Build the filter object for querying payments
  const filter = {};
  if (status) filter.status = status;
  if (period && dateFilter.$gte) filter.date = dateFilter;

  const payments = await Payment.find(filter);
  const amount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  return NextResponse.json({ amount });
}
