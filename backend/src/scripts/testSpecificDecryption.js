import crypto from 'crypto';

// Test decryption with the specific JWT_SECRET you provided
function testSpecificDecryption() {
  console.log('🔐 Testing Decryption with Your JWT_SECRET...\n');

  // Your JWT_SECRET
  const jwtSecret = "your-secret-key-here";
  
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

  console.log('\n🔓 Trying Different Decryption Methods:');

  // Method 1: Try with the exact JWT_SECRET you provided
  console.log('\n1️⃣ Method 1: Direct JWT_SECRET');
  try {
    Object.entries(encryptedData).forEach(([key, value]) => {
      try {
        const decrypted = decryptWithKey(value, jwtSecret);
        if (decrypted !== value) {
          console.log(`${key}: ✅ ${decrypted}`);
        } else {
          console.log(`${key}: ❌ Failed`);
        }
      } catch (error) {
        console.log(`${key}: ❌ Error - ${error.message}`);
      }
    });
  } catch (error) {
    console.error('❌ Method 1 failed:', error.message);
  }

  // Method 2: Try with MD5 hash of JWT_SECRET
  console.log('\n2️⃣ Method 2: MD5 hash of JWT_SECRET');
  try {
    const md5Key = crypto.createHash('md5').update(jwtSecret).digest();
    Object.entries(encryptedData).forEach(([key, value]) => {
      try {
        const decrypted = decryptWithBufferKey(value, md5Key);
        if (decrypted !== value) {
          console.log(`${key}: ✅ ${decrypted}`);
        } else {
          console.log(`${key}: ❌ Failed`);
        }
      } catch (error) {
        console.log(`${key}: ❌ Error - ${error.message}`);
      }
    });
  } catch (error) {
    console.error('❌ Method 2 failed:', error.message);
  }

  // Method 3: Try with SHA1 hash of JWT_SECRET
  console.log('\n3️⃣ Method 3: SHA1 hash of JWT_SECRET');
  try {
    const sha1Key = crypto.createHash('sha1').update(jwtSecret).digest();
    Object.entries(encryptedData).forEach(([key, value]) => {
      try {
        const decrypted = decryptWithBufferKey(value, sha1Key);
        if (decrypted !== value) {
          console.log(`${key}: ✅ ${decrypted}`);
        } else {
          console.log(`${key}: ❌ Failed`);
        }
      } catch (error) {
        console.log(`${key}: ❌ Error - ${error.message}`);
      }
    });
  } catch (error) {
    console.error('❌ Method 3 failed:', error.message);
  }

  console.log('\n✅ Decryption test completed!');
}

// Decrypt using string key (for legacy methods)
function decryptWithKey(encryptedText, key) {
  if (!encryptedText || !encryptedText.includes(':')) {
    return encryptedText;
  }

  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedData = textParts.join(':');

  try {
    // Try legacy createDecipher method
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error(`Legacy decrypt failed: ${error.message}`);
  }
}

// Decrypt using buffer key (for modern methods)
function decryptWithBufferKey(encryptedText, keyBuffer) {
  if (!encryptedText || !encryptedText.includes(':')) {
    return encryptedText;
  }

  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedData = textParts.join(':');

  try {
    // Try AES-256-CBC
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    try {
      // Try AES-128-CBC
      const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error2) {
      throw new Error(`Buffer decrypt failed: ${error2.message}`);
    }
  }
}

// Run the test
testSpecificDecryption();
