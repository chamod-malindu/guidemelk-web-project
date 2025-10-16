import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    const result = await testConnection();
    
    if (result.success) {
      console.log('✅ Connection test successful');
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        details: result
      });
    } else {
      console.log('Connection test failed');
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: result.error
      }, { status: 500 });
    }
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