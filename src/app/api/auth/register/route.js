import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role = 'tourist',
      country,
      // Optional guide-specific fields
      location,
      languages,
      experience,
      specialties,
      pricePerDay,
      bio
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUserData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isEmailVerified: false,
      emailVerifiedAt: null
    };

    // If role is tourist, attach tourist-specific fields
    if (role === 'tourist') {
      newUserData.country = country?.trim() || 'Not Given';
    }


    // If role is guide, attach guide-specific fields
    if (role === 'guide') {
      newUserData.location = location?.trim() || 'Not Given';
      newUserData.languages = Array.isArray(languages) ? languages : [];
      newUserData.experience = Number.isInteger(experience) ? experience : 0;
      newUserData.specialties = Array.isArray(specialties) ? specialties : [];
      newUserData.pricePerDay = typeof pricePerDay === 'number' ? pricePerDay : 0;
      newUserData.bio = bio?.trim() || 'Not Provided';
    }

    // Create the new user in the database
    const user = await User.create(newUserData);

    // Generate JWT token for email verification
    const token = createToken({
      _id: user._id,
      email: user.email,
      role: user.role
    });

    // Send the verification email using your utility function
    await sendVerificationEmail(user.email, token);

    // Respond to frontend
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
