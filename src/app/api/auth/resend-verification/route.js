import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { createToken } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 })
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 })
    }

    const token = createToken({
      _id: user._id,
      email: user.email,
      role: user.role
    })

    await sendVerificationEmail(user.email, token)

    return NextResponse.json({ message: 'Verification email resent successfully' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
