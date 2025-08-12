import encryptionService from '../services/encryptionService.js';
import legacyDecryptionService from '../services/legacyDecryptionService.js';

// Test decryption of the specific encrypted data you provided
function testDecryption() {
  console.log('🔐 Testing Decryption of Your Data...\n');

  // Your encrypted data
  const encryptedData = {
    name: 'abea7504100fcd7aacdcffeabad89b5b:4d6c31338c8a3e50c830340585f97791',
    phone: 'ef034e1fbf7e6ecf0bb54cd320bb9e42:2e1bfd9770bf43c3e5932f36c3a8a20a',
    gst: 'dcf18e5ce5e5eaf6e9825d7aa670a31f:ba4e8dfd8fd013c4658b4322ff05d7c6',
    pan: 'afbe925c36451f8be503f0ea9e9919e8:86a398be6e26984aa2f0803ade5e718c',
    address: '1fd86d506edb839f7c4f174bc7c1c624:5b4b1b148c6950cccb1fd373304ab2ff',
    city: 'b3533ded2c142be6272d8b7b8247c3f9:d0dfeeb9352aa03870d82430a6d769b1',
    pinCode: 'db7db4529fd774167071ac530eda80bd:4904fa4b209d154eb5f10a7ed2c11b3b2515b0be94cef65ef4014be58a89bf13',
    state: '55c19419e8a2ffd71c00678c51e71049:b547d535f6a4682ca241a8adeb238f24',
    locality: '5577d4059fe80c36f64c7e47d563e1cd:87ac205592edc00a62048063ef8bea3e',
    streetName: 'e38d218a7a945f811d01e155d58814f6:45f6d06ef92685acc7f74d65f3b22dbf',
    houseNumber: 'b9912b62ea0dcc822d61e478ffbefd7d:5a1286af6538a8caac6b3f4ee6735201'
  };

  console.log('🔒 Encrypted Data:');
  Object.entries(encryptedData).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });

  console.log('\n🔓 Trying New Encryption Service:');
  try {
    Object.entries(encryptedData).forEach(([key, value]) => {
      try {
        const decrypted = encryptionService.decrypt(value);
        console.log(`${key}: ${decrypted}`);
      } catch (error) {
        console.log(`${key}: ❌ Failed - ${error.message}`);
      }
    });
  } catch (error) {
    console.error('❌ New encryption service failed:', error.message);
  }

  console.log('\n🔓 Trying Legacy Decryption Service:');
  try {
    Object.entries(encryptedData).forEach(([key, value]) => {
      try {
        const decrypted = legacyDecryptionService.decryptLegacy(value);
        if (decrypted !== value) {
          console.log(`${key}: ✅ ${decrypted}`);
        } else {
          console.log(`${key}: ❌ Failed - Could not decrypt`);
        }
      } catch (error) {
        console.log(`${key}: ❌ Failed - ${error.message}`);
      }
    });
  } catch (error) {
    console.error('❌ Legacy decryption service failed:', error.message);
  }

  console.log('\n✅ Decryption test completed!');
}

// Run the test
testDecryption();
