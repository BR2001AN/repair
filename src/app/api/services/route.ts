import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const skill = searchParams.get('skill');
    const verified = searchParams.get('verified');

    const where = {
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
      ...(skill && { skills: { has: skill } }),
      ...(verified && { isVerified: verified === 'true' }),
    };

    const technicians = await prisma.technician.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    });

    // Calculate average rating for each technician
    const techniciansWithAvgRating = technicians.map((tech: { reviews: any[]; }) => ({
      ...tech,
      averageRating: tech.reviews.length > 0 
        ? tech.reviews.reduce((acc, review) => acc + review.rating, 0) / tech.reviews.length
        : 0,
      totalReviews: tech.reviews.length,
    }));

    return NextResponse.json(techniciansWithAvgRating);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      specialty, 
      experience, 
      skills, 
      location, 
      priceRange,
      description 
    } = body;

    if (!userId || !specialty || !location) {
      return NextResponse.json(
        { error: 'User ID, specialty, and location are required' },
        { status: 400 }
      );
    }

    // Check if technician profile already exists
    const existingTechnician = await prisma.technician.findUnique({
      where: { userId },
    });

    if (existingTechnician) {
      return NextResponse.json(
        { error: 'Technician profile already exists for this user' },
        { status: 400 }
      );
    }

    const technician = await prisma.technician.create({
      data: {
        userId,
        specialty,
        experience: parseInt(experience) || 0,
        skills: skills || [],
        location,
        priceRange: priceRange || {},
        description,
        isAvailable: true,
        isVerified: false, // Default to false, admin can verify later
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(technician, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service profile' },
      { status: 500 }
    );
  }
}