import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    // Upsert the default password if it doesn't exist
    // Using upsert ensures it's created if missing, but doesn't overwrite if it exists
    const adminPasswordRecord = await prisma.websiteData.upsert({
      where: { key: 'admin_password' },
      update: {},
      create: {
        key: 'admin_password',
        value: 'sai@adversitymedia0101'
      }
    });

    if (password === adminPasswordRecord.value) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error validating password:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate password' }, { status: 500 });
  }
}
