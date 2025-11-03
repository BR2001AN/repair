import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const repairId = searchParams.get('repairId');
    const technicianId = searchParams.get('technicianId');

    if (!productId && !repairId && !technicianId) {
      return NextResponse.json(
        { error: 'productId, repairId, or technicianId is required' },
        { status: 400 }
      );
    }

    const where = {
      ...(productId && { productId }),
      ...(repairId && { repairId }),
      ...(technicianId && { technicianId }),
    };

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
        repair: {
          select: {
            id: true,
            title: true,
          },
        },
        technician: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      rating, 
      comment, 
      customerId, 
      productId, 
      repairId, 
      technicianId 
    } = body;

    if (!rating || !customerId) {
      return NextResponse.json(
        { error: 'Rating and customer ID are required' },
        { status: 400 }
      );
    }

    // Validate that review is for either product or repair/technician
    if (!productId && !repairId && !technicianId) {
      return NextResponse.json(
        { error: 'Must review either a product, repair, or technician' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this item
    const existingReview = await prisma.review.findFirst({
      where: {
        customerId,
        OR: [
          { productId },
          { repairId },
          { technicianId },
        ].filter(Boolean),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this item' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        customerId,
        productId,
        repairId,
        technicianId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
        repair: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update technician rating if review is for a technician
    if (technicianId) {
      await updateTechnicianRating(technicianId);
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

async function updateTechnicianRating(technicianId: string) {
  const reviews = await prisma.review.findMany({
    where: { technicianId },
    select: { rating: true },
  });

  if (reviews.length > 0) {
    const averageRating = reviews.reduce((acc: any, review: { rating: any; }) => acc + review.rating, 0) / reviews.length;
    
    await prisma.technician.update({
      where: { id: technicianId },
      data: { 
        rating: averageRating,
        totalJobs: reviews.length,
      },
    });
  }
}