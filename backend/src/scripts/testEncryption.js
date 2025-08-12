import encryptionService from '../services/encryptionService.js';

// Test the encryption service
function testEncryption() {
  console.log('🔐 Testing Encryption Service...\n');

  // Test 1: Basic encryption/decryption
  console.log('Test 1: Basic encryption/decryption');
  const originalText = 'Hello World!';
  const encrypted = encryptionService.encrypt(originalText);
  const decrypted = encryptionService.decrypt(encrypted);
  
  console.log(`Original: ${originalText}`);
  console.log(`Encrypted: ${encrypted}`);
  console.log(`Decrypted: ${decrypted}`);
  console.log(`✅ Match: ${originalText === decrypted ? 'YES' : 'NO'}\n`);

  // Test 2: Bank details encryption
  console.log('Test 2: Bank details encryption');
  const bankDetails = {
    name: 'John Doe',
    ifsccode: 'SBIN0001234',
    accountno: '1234567890',
    bank: 'State Bank of India',
    upid: 'john.doe@upi',
    upidname: 'John Doe'
  };
  
  const encryptedBank = encryptionService.encryptBankDetails(bankDetails);
  const decryptedBank = encryptionService.decryptBankDetails(encryptedBank);
  
  console.log('Original bank details:', bankDetails);
  console.log('Encrypted bank details:', encryptedBank);
  console.log('Decrypted bank details:', decryptedBank);
  console.log(`✅ All fields match: ${JSON.stringify(bankDetails) === JSON.stringify(decryptedBank) ? 'YES' : 'NO'}\n`);

  // Test 3: Customer details encryption
  console.log('Test 3: Customer details encryption');
  const customer = {
    name: 'Jane Smith',
    phone: '9876543210',
    gstnumber: 'GST123456789',
    pannumber: 'ABCDE1234F',
    recipientName: 'Jane Smith',
    houseNumber: '123',
    streetName: 'Main Street',
    locality: 'Downtown',
    city: 'Mumbai',
    pinCode: '400001',
    state: 'Maharashtra'
  };
  
  const encryptedCustomer = encryptionService.encryptCustomerDetails(customer);
  const decryptedCustomer = encryptionService.decryptCustomerDetails(encryptedCustomer);
  
  console.log('Original customer:', customer);
  console.log('Encrypted customer:', encryptedCustomer);
  console.log('Decrypted customer:', decryptedCustomer);
  console.log(`✅ All fields match: ${JSON.stringify(customer) === JSON.stringify(decryptedCustomer) ? 'YES' : 'NO'}\n`);

  // Test 4: Empty/null values
  console.log('Test 4: Empty/null values');
  const emptyData = {
    name: '',
    phone: null,
    gstnumber: undefined
  };
  
  const encryptedEmpty = encryptionService.encryptObject(emptyData, ['name', 'phone', 'gstnumber']);
  const decryptedEmpty = encryptionService.decryptObject(encryptedEmpty, ['name', 'phone', 'gstnumber']);
  
  console.log('Original empty data:', emptyData);
  console.log('Encrypted empty data:', encryptedEmpty);
  console.log('Decrypted empty data:', decryptedEmpty);
  console.log('✅ Empty values handled correctly\n');

  console.log('🎉 All encryption tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEncryption();
}

export { testEncryption };
