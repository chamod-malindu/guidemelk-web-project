import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  console.log('Registration endpoint hit');
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('Request body received:', { ...body, password: '[HIDDEN]' });

    // Destructure fields from request body
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role = 'tourist',
      country,
      // Optional guide-specific fields
      location,
      languages,
      experience,
      specialties,
      pricePerDay,
      bio
    } = body;

    console.log('Extracted fields:', {
      firstName,
      lastName,
      email,
      role,
      phone,
      country,
      location,
      hasPassword: !!password
    });

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    // Check password minimum length
    if (password.length < 6) {
      console.log('Password too short');
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format');
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    console.log('Basic validation passed');

    // Establish database connection
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('MongoDB connected successfully');

    // Check if user already exists with this email
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    console.log('User does not exist, proceeding...');

    // Hash password with bcrypt
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create base user data object
    const newUserData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || '',
      role,
      isEmailVerified: false,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add tourist-specific fields
    if (role === 'tourist') {
      newUserData.country = country?.trim() || 'Not Given';
      console.log('Tourist-specific fields added');
    }

    // Add guide-specific fields
    if (role === 'guide') {
      // Helper function to convert comma-separated string to array
      const toArray = (input) => {
        if (Array.isArray(input)) return input;
        if (typeof input === 'string') {
          return input.split(',').map(i => i.trim()).filter(i => i);
        }
        return [];
      };
    
      // Helper function to safely parse number
      const toNumber = (input) => {
        if (typeof input === 'number') return input;
        if (typeof input === 'string') {
          const parsed = parseFloat(input);
          return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
      };
    
      newUserData.location = location?.trim() || 'Not Given';
      newUserData.languages = toArray(languages);
      newUserData.experience = toNumber(experience);
      newUserData.specialties = toArray(specialties);
      newUserData.pricePerDay = toNumber(pricePerDay);
      newUserData.bio = bio?.trim() || 'Not Provided';
      console.log('Guide-specific fields added:', {
        location: newUserData.location,
        languages: newUserData.languages,
        experience: newUserData.experience,
        specialties: newUserData.specialties,
        pricePerDay: newUserData.pricePerDay
      });
    }

    // Create user in database
    console.log('Creating user in database...');
    const user = await User.create(newUserData);
    console.log('User created successfully with ID:', user._id);

    // Send email verification
    console.log('Sending verification email...');
    
    try {
      // Generate token and send verification email
      const token = createToken(user);
      await sendVerificationEmail(user.email, token);
      console.log('Verification email sent');
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
      // Continue registration even if email fails
    }

    console.log('Registration completed successfully');
    // Return success response with user data
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      console.log('Mongoose validation error:', error.message);
      return NextResponse.json({ 
        error: 'Invalid data provided', 
        details: error.message 
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log('Duplicate key error:', error.message);
      return NextResponse.json({ 
        error: 'Email already registered' 
      }, { status: 400 });
    }
    
    // Handle general errors
    return NextResponse.json({ 
      error: 'Registration failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}