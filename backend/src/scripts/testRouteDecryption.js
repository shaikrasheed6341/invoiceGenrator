import workingDecryptionService from '../services/workingDecryptionService.js';

// Test that the decryption service works correctly
function testRouteDecryption() {
  console.log('🧪 Testing Route Decryption...\n');

  // Simulate encrypted data from database (like what your routes would receive)
  const encryptedCustomerFromDB = {
    id: '2d587d09-3216-4976-8024-aaa27d11e724',
    name: 'abea7504100fcd7aacdcffeabad89b5b:4d6c31338c8a3e50c830340585f97791',
    phone: 'ef034e1fbf7e6ecf0bb54cd320bb9e42:2e1bfd9770bf43c3e5932f36c3a8a20a',
    gstnumber: 'dcf18e5ce5e5eaf6e9825d7aa670a31f:ba4e8dfd8fd013c4658b4322ff05d7c6',
    pannumber: 'afbe925c36451f8be503f0ea9e9919e8:86a398be6e26984aa2f0803ade5e718c',
    city: '5577d4059fe80c36f64c7e47d563e1cd:87ac205592edc00a62048063ef8bea3e',
    houseNumber: 'b3533ded2c142be6272d8b7b8247c3f9:d0dfeeb9352aa03870d82430a6d769b1',
    locality: '55c19419e8a2ffd71c00678c51e71049:b547d535f6a4682ca241a8adeb238f24',
    pinCode: 'e38d218a7a945f811d01e155d58814f6:45f6d06ef92685acc7f74d65f3b22dbf',
    recipientName: '1fd86d506edb839f7c4f174bc7c1c624:5b4b1b148c6950cccb1fd373304ab2ff',
    state: 'b9912b62ea0dcc822d61e478ffbefd7d:5a1286af6538a8caac6b3f4ee6735201',
    streetName: '',
    ownerId: '61f87706-ee4f-4f33-a43f-3e0d372be774',
    createdAt: '2025-12-08T14:57:06.000Z',
    updatedAt: '2025-12-08T14:57:06.000Z'
  };

  console.log('🔒 Encrypted Data from Database:');
  console.log(JSON.stringify(encryptedCustomerFromDB, null, 2));

  console.log('\n🔓 Decrypted Data (What users will see):');
  const decryptedCustomer = workingDecryptionService.decryptCustomerDetails(encryptedCustomerFromDB);
  console.log(JSON.stringify(decryptedCustomer, null, 2));

  console.log('\n✅ Test Results:');
  console.log('📱 Phone:', decryptedCustomer.phone);
  console.log('👤 Name:', decryptedCustomer.name);
  console.log('🏢 GST:', decryptedCustomer.gstnumber);
  console.log('🆔 PAN:', decryptedCustomer.pannumber);
  console.log('🏠 City:', decryptedCustomer.city);
  console.log('🏘️ Locality:', decryptedCustomer.locality);
  console.log('📮 Pin Code:', decryptedCustomer.pinCode);
  console.log('🏛️ State:', decryptedCustomer.state);

  console.log('\n💡 This is exactly what your routes will do:');
  console.log('1. Fetch encrypted data from database');
  console.log('2. Use workingDecryptionService.decryptCustomerDetails()');
  console.log('3. Send decrypted data to frontend');
  console.log('4. Users see readable text instead of encrypted gibberish');

  return decryptedCustomer;
}

// Run the test
const decryptedData = testRouteDecryption();

// Export for use in other scripts
export { decryptedData };
