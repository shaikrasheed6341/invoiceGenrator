import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testBankDetails() {
    try {
        console.log("=== TESTING BANK DETAILS ===");
        
        // Test 1: Check if we can connect to the database
        console.log("1. Testing database connection...");
        await prisma.$connect();
        console.log("✅ Database connection successful");
        
        // Test 2: Check if BankDetails table exists and has data
        console.log("\n2. Checking BankDetails table...");
        const bankDetailsCount = await prisma.bankDetails.count();
        console.log(`Total bank details in database: ${bankDetailsCount}`);
        
        if (bankDetailsCount > 0) {
            const allBankDetails = await prisma.bankDetails.findMany({
                select: {
                    id: true,
                    accountno: true,
                    ownerId: true,
                    name: true,
                    bank: true
                }
            });
            console.log("Sample bank details:", allBankDetails);
        }
        
        // Test 3: Check if Owner table has data
        console.log("\n3. Checking Owner table...");
        const ownerCount = await prisma.owner.count();
        console.log(`Total owners in database: ${ownerCount}`);
        
        if (ownerCount > 0) {
            const allOwners = await prisma.owner.findMany({
                select: {
                    id: true,
                    email: true
                }
            });
            console.log("Sample owners:", allOwners);
        }
        
        // Test 4: Check if Customer table has data
        console.log("\n4. Checking Customer table...");
        const customerCount = await prisma.customer.count();
        console.log(`Total customers in database: ${customerCount}`);
        
        if (customerCount > 0) {
            const allCustomers = await prisma.customer.findMany({
                select: {
                    id: true,
                    phone: true,
                    ownerId: true
                }
            });
            console.log("Sample customers:", allCustomers);
        }
        
        // Test 5: Check if Item table has data
        console.log("\n5. Checking Item table...");
        const itemCount = await prisma.item.count();
        console.log(`Total items in database: ${itemCount}`);
        
        if (itemCount > 0) {
            const allItems = await prisma.item.findMany({
                select: {
                    id: true,
                    name: true,
                    ownerId: true
                }
            });
            console.log("Sample items:", allItems);
        }
        
        // Test 6: Simulate the exact query from the quotation route
        console.log("\n6. Simulating quotation route queries...");
        
        if (ownerCount > 0 && bankDetailsCount > 0) {
            const firstOwner = await prisma.owner.findFirst({
                select: { id: true, email: true }
            });
            
            console.log(`Testing with owner: ${firstOwner.email} (ID: ${firstOwner.id})`);
            
            // Test owner lookup
            const ownerExist = await prisma.owner.findUnique({
                where: { email: firstOwner.email },
                select: { id: true },
            });
            console.log("Owner lookup result:", ownerExist);
            
            if (ownerExist) {
                // Test bank details lookup
                const firstBankDetail = await prisma.bankDetails.findFirst({
                    where: { ownerId: ownerExist.id },
                    select: { accountno: true, id: true }
                });
                
                if (firstBankDetail) {
                    console.log(`Testing bank details lookup with accountno: ${firstBankDetail.accountno}`);
                    
                    const bankExists = await prisma.bankDetails.findFirst({
                        where: { 
                            accountno: firstBankDetail.accountno,
                            ownerId: ownerExist.id
                        },
                        select: { id: true },
                    });
                    console.log("Bank details lookup result:", bankExists);
                }
            }
        }
        
    } catch (error) {
        console.error("❌ Error during testing:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testBankDetails();
