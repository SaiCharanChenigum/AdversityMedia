import React from 'react';
import ClientsAdminClient from './ClientsAdminClient';
import { prisma } from '@/lib/prisma';
import ProtectedRoute from '../components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const statsData = await prisma.websiteData.findUnique({
    where: { key: 'clients_stats' }
  });
  
  const industriesData = await prisma.websiteData.findUnique({
    where: { key: 'clients_industries' }
  });

  const stats = statsData ? JSON.parse(statsData.value) : {
    happyClients: '50',
    industriesServed: '15',
    satisfaction: '98',
    repeatClients: '85'
  };

  const industries = industriesData ? JSON.parse(industriesData.value) : [
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'retail', label: 'Retail & E-commerce' },
    { id: 'technology', label: 'Technology' },
    { id: 'fashion', label: 'Fashion & Lifestyle' }
  ];

  return (
    <ProtectedRoute>
      <ClientsAdminClient initialClients={clients} initialStats={stats} initialIndustries={industries} />
    </ProtectedRoute>
  );
}
