import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Purchase from '@/models/Purchase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const course = await Course.findById(id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    let hasAccess = false;
    if (userId) {
      const purchase = await Purchase.findOne({ 
        courseId: id, 
        userId 
      });
      hasAccess = !!purchase;
    }

    const courseData = course.toObject();
    
    // If user doesn't have access, hide content
    if (!hasAccess) {
      courseData.content = null;
    }

    return NextResponse.json({ ...courseData, hasAccess });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const course = await Course.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true }
    );

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
