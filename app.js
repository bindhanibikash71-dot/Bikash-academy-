import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const course = await Course.create({
      ...data,
      content: {
        videos: data.content?.videos || [],
        links: data.content?.links || [],
        apps: data.content?.apps || [],
        pdfs: data.content?.pdfs || []
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
