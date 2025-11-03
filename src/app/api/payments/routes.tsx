import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      amount, 
      type, 
      orderId,
      paymentMethod,
      mpesaNumber 
    } = body;

    if (!userId || !amount || !type || !orderId) {
      return NextResponse.json(
        { error: 'User ID, amount, type, and order ID are required' },
        { status: 400 }
      );
    }

    // Validate order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.buyerId !== userId) {
      return NextResponse.json(
        { error: 'Order does not belong to user' },
        { status: 403 }
      );
    }

    // Determine payment status based on payment method
    let status: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING';
    
    if (paymentMethod === 'CASH_ON_PICKUP') {
      status = 'SUCCESS'; // Auto-success for cash on pickup
    } else if (paymentMethod === 'MPESA') {
      // Simulate M-Pesa payment processing
      status = await simulateMpesaPayment(mpesaNumber, amount);
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
        type,
        status,
        orderId,
        paymentMethod,
        mpesaNumber: mpesaNumber || null,
        processedAt: status === 'SUCCESS' ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
      },
    });

    // If payment is successful, update order status
    if (status === 'SUCCESS') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Simulate M-Pesa payment processing
async function simulateMpesaPayment(mpesaNumber: string, amount: number): Promise<'SUCCESS' | 'FAILED'> {
  // In a real implementation, this would integrate with M-Pesa API
  // For simulation, we'll randomly succeed 90% of the time
  
  // Validate M-Pesa number format (Kenyan numbers)
  const mpesaRegex = /^(254|0)?[17]\d{8}$/;
  if (!mpesaNumber || !mpesaRegex.test(mpesaNumber.replace(/\s/g, ''))) {
    return 'FAILED';
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 90% success rate for simulation
  return Math.random() < 0.9 ? 'SUCCESS' : 'FAILED';
}