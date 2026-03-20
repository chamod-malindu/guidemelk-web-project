import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await dbConnect();
    
    console.log('✅ Connection test successful');
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
    });

  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    }, { status: 500 });
  }
}

// Also allow POST for testing
export async function POST() {
  return GET();
}