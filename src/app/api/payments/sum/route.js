import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const period = url.searchParams.get('period');

  const now = new Date();
  let dateFilter = {};
  if (period === 'thisMonth') {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    dateFilter = { $gte: first, $lte: last };
  }

  const filter = {};
  if (status) filter.status = status;
  if (period && dateFilter.$gte) filter.date = dateFilter;

  const payments = await Payment.find(filter);
  const amount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  return NextResponse.json({ amount });
}
