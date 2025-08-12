import { PrismaClient } from '@prisma/client';
import encryptionService from '../services/encryptionService.js';

const prisma = new PrismaClient();

async function encryptExistingData() {
  try {
    console.log('🔐 Starting encryption of existing data...');

    // Encrypt existing bank details
    console.log('🏦 Encrypting bank details...');
    const bankDetails = await prisma.bankDetails.findMany();
    for (const bankDetail of bankDetails) {
      // Check if data is already encrypted
      if (!bankDetail.name.includes(':')) {
        const encryptedData = encryptionService.encryptBankDetails(bankDetail);
        await prisma.bankDetails.update({
          where: { id: bankDetail.id },
          data: encryptedData
        });
        console.log(`✅ Encrypted bank details for: ${bankDetail.id}`);
      } else {
        console.log(`🔒 Bank details already encrypted for: ${bankDetail.id}`);
      }
    }

    // Encrypt existing customers
    console.log('👥 Encrypting customer data...');
    const customers = await prisma.customer.findMany();
    for (const customer of customers) {
      // Check if data is already encrypted
      if (!customer.name.includes(':')) {
        const encryptedData = encryptionService.encryptCustomerDetails(customer);
        await prisma.customer.update({
          where: { id: customer.id },
          data: encryptedData
        });
        console.log(`✅ Encrypted customer data for: ${customer.id}`);
      } else {
        console.log(`🔒 Customer data already encrypted for: ${customer.id}`);
      }
    }

    // Encrypt existing owners
    console.log('👤 Encrypting owner data...');
    const owners = await prisma.owner.findMany();
    for (const owner of owners) {
      // Check if data is already encrypted
      if (!owner.name.includes(':')) {
        const encryptedData = encryptionService.encryptOwnerDetails(owner);
        await prisma.owner.update({
          where: { id: owner.id },
          data: encryptedData
        });
        console.log(`✅ Encrypted owner data for: ${owner.id}`);
      } else {
        console.log(`🔒 Owner data already encrypted for: ${owner.id}`);
      }
    }

    console.log('🎉 All existing data has been encrypted successfully!');
  } catch (error) {
    console.error('❌ Error encrypting existing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the encryption script
if (import.meta.url === `file://${process.argv[1]}`) {
  encryptExistingData();
}

export { encryptExistingData };
