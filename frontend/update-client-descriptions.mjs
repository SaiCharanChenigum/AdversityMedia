import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const htmlPath = 'C:/Users/cheni/OneDrive/Desktop/LifeAdversity Media/clients.html';
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract the clientData object
  const startIndex = html.indexOf('const clientData = {');
  if (startIndex === -1) throw new Error("Could not find clientData");
  
  const endMarker = '        // Client filtering functionality';
  const endIndex = html.indexOf(endMarker, startIndex);
  if (endIndex === -1) throw new Error("Could not find end of clientData");
  
  const scriptContent = html.substring(startIndex, endIndex).trim();
  // It will be something like: const clientData = { ... };
  
  // Create a function to evaluate it and return the object
  const getClientData = new Function(`
    ${scriptContent}
    return clientData;
  `);
  
  const data = getClientData();
  
  let updated = 0;
  for (const key in data) {
    const client = data[key];
    
    // Find the client in DB by name
    const dbClient = await prisma.client.findFirst({
      where: { name: client.name }
    });
    
    if (dbClient) {
      await prisma.client.update({
        where: { id: dbClient.id },
        data: {
          description: client.description,
          services: client.services
        }
      });
      console.log(`Updated ${client.name} with description and services.`);
      updated++;
    } else {
      console.log(`Could not find ${client.name} in database to update.`);
    }
  }
  
  console.log(`Successfully updated ${updated} clients!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
