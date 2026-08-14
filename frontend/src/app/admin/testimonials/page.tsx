import React from 'react';
import TestimonialsAdminClient from './TestimonialsAdminClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <TestimonialsAdminClient initialTestimonials={testimonials} />;
}
