import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Create response
    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: "Internal server error during logout" },
      { status: 500 }
    );
  }
}

// Also handle GET requests for logout links
export async function GET(request) {
  try {

    const response = NextResponse.redirect(new URL('/login', request.url));

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}