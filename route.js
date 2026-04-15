import connectDB from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { uid, email, name, photoURL } = await request.json();

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email,
        name,
        photoURL,
        isAdmin: email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
      });
    } else {
      // Update user info if changed
      user.name = name;
      user.photoURL = photoURL;
      await user.save();
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
