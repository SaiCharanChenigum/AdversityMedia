
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const clients = [
  {
    "name": "Pack Partners",
    "category": "Private Limited",
    "industry": "retail",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/pack.jpg",
    "services": [
      "Digital Marketing",
      "Branding"
    ]
  },
  {
    "name": "Prakriti Nature Ka Touch",
    "category": "Healthcare & Wellness",
    "industry": "healthcare",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/PNKT.jpg",
    "services": [
      "SEO",
      "Social Media"
    ]
  },
  {
    "name": "AITAM",
    "category": "Aditya Institute of Technology and Management",
    "industry": "education",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/aitam.jpg",
    "services": [
      "Web Development",
      "Digital Marketing"
    ]
  },
  {
    "name": "MPN Resorts & Hotels",
    "category": "Hospitality & Tourism",
    "industry": "hospitality",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/MPN.jpg",
    "services": [
      "Branding",
      "Social Media"
    ]
  },
  {
    "name": "Golden Woods Retreat",
    "category": "Luxury Resort",
    "industry": "hospitality",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/golden.jpg",
    "services": [
      "Web Design",
      "SEO"
    ]
  },
  {
    "name": "Sakhi Resort",
    "category": "Luxury Lake View Resort",
    "industry": "hospitality",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/sakhi.jpg",
    "services": [
      "Content Marketing",
      "Photography"
    ]
  },
  {
    "name": "Hotel Srisaila's Nest",
    "category": "Boutique Hotel",
    "industry": "hospitality",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/hotel-srisailas.jpg",
    "services": [
      "Digital Marketing",
      "Local SEO"
    ]
  },
  {
    "name": "Country Side Resorts",
    "category": "Resort & Hospitality",
    "industry": "hospitality",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/resort.jpg",
    "services": [
      "Social Media",
      "Branding"
    ]
  },
  {
    "name": "Ar Collections",
    "category": "Luxury in Every Stitch",
    "industry": "fashion",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/Ar.jpg",
    "services": [
      "E-commerce",
      "Fashion Marketing"
    ]
  },
  {
    "name": "The Hot Stone Studio",
    "category": "Spa & Saloon",
    "industry": "fashion",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/spa.jpg",
    "services": [
      "Local Marketing",
      "Social Media"
    ]
  },
  {
    "name": "Akshara Rehabilitation Centre",
    "category": "Healthcare & Wellness",
    "industry": "healthcare",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/akshara.jpg",
    "services": [
      "Rehabilitation",
      "De-addiction",
      "Wellness Campaigns"
    ]
  },
  {
    "name": "HRC",
    "category": "Hyderabad Rehabilitation Center",
    "industry": "healthcare",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/HRC.jpg",
    "services": [
      "Healthcare Marketing",
      "SEO"
    ]
  },
  {
    "name": "Dr. Santosh Gattu",
    "category": "Infectious Diseases Specialist",
    "industry": "healthcare",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/dr-santosh-gattu.jpg",
    "services": [
      "Healthcare Marketing",
      "Branding",
      "Patient Outreach"
    ]
  },
  {
    "name": "Harsha Clinics",
    "category": "Pharmacy & Diagnostics",
    "industry": "healthcare",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/client-logos.jpg",
    "services": [
      "Medical Marketing",
      "Digital Presence"
    ]
  },
  {
    "name": "Krafteria",
    "category": "Where Krafts Meet Community",
    "industry": "retail",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/KRAFTERIA.jpg",
    "services": [
      "E-commerce",
      "Community Building"
    ]
  },
  {
    "name": "Mythili",
    "category": "The Label",
    "industry": "fashion",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/mythili.jpg",
    "services": [
      "Brand Identity",
      "Fashion Marketing"
    ]
  },
  {
    "name": "Genex Rehab And Hospitals",
    "category": "Rehabilitation & Healthcare",
    "industry": "healthcare",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/genex.jpg",
    "services": [
      "Healthcare Marketing",
      "Branding",
      "Local SEO"
    ]
  },
  {
    "name": "Varahi Conventions",
    "category": "Conventions & Events",
    "industry": "hospitality",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/varahi.jpg",
    "services": [
      "Event Branding",
      "Social Media",
      "Promotional Design"
    ]
  },
  {
    "name": "Nexgen Brook International School",
    "category": "International School",
    "industry": "education",
    "logoUrl": "https://res.cloudinary.com/deftcnxf/image/upload/Adversity-media%20client%20logos/nexgen-brook.jpg",
    "services": [
      "Admissions Campaigns",
      "School Branding",
      "Social Media"
    ]
  }
];

  console.log('Seeding ' + clients.length + ' clients...');

  // Optional: clear existing clients
  await prisma.client.deleteMany();

  for (const c of clients) {
    await prisma.client.create({
      data: c
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
