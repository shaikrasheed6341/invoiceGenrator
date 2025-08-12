import crypto from 'crypto';

// Comprehensive decryption testing to find the right method
function findDecryptionMethod() {
  console.log('🔐 Finding the Right Decryption Method...\n');

  // Your encrypted data
  const encryptedData = {
    name: 'abea7504100fcd7aacdcffeabad89b5b:4d6c31338c8a3e50c830340585f97791',
    phone: 'ef034e1fbf7e6ecf0bb54cd320bb9e42:2e1bfd9770bf43c3e5932f36c3a8a20a'
  };

  // Test different JWT_SECRET values
  const possibleSecrets = [
    "your-secret-key-here",
    "your-secret-key-here", // Original
    "secret-key-here",
    "secret-key",
    "your-secret",
    "secret",
    "key",
    "jwt-secret",
    "jwt",
    "default-secret",
    "fallback-secret-key-for-encryption"
  ];

  console.log('🔒 Testing with different JWT_SECRET values...\n');

  for (let i = 0; i < possibleSecrets.length; i++) {
    const secret = possibleSecrets[i];
    console.log(`\n🔑 Testing JWT_SECRET ${i + 1}: "${secret}"`);
    
    // Test different decryption methods with this secret
    const methods = [
      { name: 'AES-256-CBC + SHA256', fn: () => tryAES256CBC(encryptedData.name, secret) },
      { name: 'AES-128-CBC + MD5', fn: () => tryAES128CBC(encryptedData.name, secret) },
      { name: 'AES-128-CBC + SHA1', fn: () => tryAES128CBC(encryptedData.name, secret, 'sha1') },
      { name: 'AES-128-CBC + SHA256', fn: () => tryAES128CBC(encryptedData.name, secret, 'sha256') },
      { name: 'Simple XOR', fn: () => trySimpleXOR(encryptedData.name, secret) },
      { name: 'Reverse XOR', fn: () => tryReverseXOR(encryptedData.name, secret) }
    ];

    for (const method of methods) {
      try {
        const result = method.fn();
        if (result && result !== encryptedData.name && result.length > 0) {
          console.log(`  ✅ ${method.name}: "${result}"`);
          
          // If we found a working method, test it on all data
          console.log(`\n🎉 Found working method: ${method.name} with secret "${secret}"`);
          console.log('🔓 Decrypting all data...\n');
          
          const allDecrypted = decryptAllData(encryptedData, secret, method.name);
          console.log('📋 All Decrypted Data:');
          Object.entries(allDecrypted).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
          });
          
          return; // Exit after finding working method
        }
      } catch (error) {
        // Continue to next method
      }
    }
  }

  console.log('\n❌ No working decryption method found with any of the tested secrets.');
  console.log('💡 The data might be encrypted with:');
  console.log('   - A different JWT_SECRET than tested');
  console.log('   - A completely different encryption method');
  console.log('   - A custom encryption algorithm');
}

// Try AES-256-CBC with SHA256 hash
function tryAES256CBC(encryptedText, secret) {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedData = textParts.join(':');
  const key = crypto.createHash('sha256').update(secret).digest();
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Try AES-128-CBC with different hash methods
function tryAES128CBC(encryptedText, secret, hashMethod = 'md5') {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedData = textParts.join(':');
  const key = crypto.createHash(hashMethod).update(secret).digest().slice(0, 16);
  
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Try simple XOR decryption
function trySimpleXOR(encryptedText, secret) {
  const textParts = encryptedText.split(':');
  const encryptedData = textParts.join(':');
  
  const keyBytes = Buffer.from(secret, 'utf8');
  const encryptedBuffer = Buffer.from(encryptedData, 'hex');
  
  let decrypted = '';
  for (let i = 0; i < encryptedBuffer.length; i++) {
    const keyByte = keyBytes[i % keyBytes.length];
    const encryptedByte = encryptedBuffer[i];
    decrypted += String.fromCharCode(encryptedByte ^ keyByte);
  }
  
  return decrypted;
}

// Try reverse XOR decryption
function tryReverseXOR(encryptedText, secret) {
  const textParts = encryptedText.split(':');
  const encryptedData = textParts.join(':');
  
  const keyBytes = Buffer.from(secret, 'utf8');
  const encryptedBuffer = Buffer.from(encryptedData, 'hex');
  
  let decrypted = '';
  for (let i = 0; i < encryptedBuffer.length; i++) {
    const keyByte = keyBytes[i % keyBytes.length];
    const encryptedByte = encryptedBuffer[i];
    decrypted += String.fromCharCode(keyByte ^ encryptedByte);
  }
  
  return decrypted;
}

// Decrypt all data using the found method
function decryptAllData(data, secret, methodName) {
  const decrypted = {};
  
  Object.entries(data).forEach(([key, value]) => {
    try {
      switch (methodName) {
        case 'AES-256-CBC + SHA256':
          decrypted[key] = tryAES256CBC(value, secret);
          break;
        case 'AES-128-CBC + MD5':
          decrypted[key] = tryAES128CBC(value, secret, 'md5');
          break;
        case 'AES-128-CBC + SHA1':
          decrypted[key] = tryAES128CBC(value, secret, 'sha1');
          break;
        case 'AES-128-CBC + SHA256':
          decrypted[key] = tryAES128CBC(value, secret, 'sha256');
          break;
        case 'Simple XOR':
          decrypted[key] = trySimpleXOR(value, secret);
          break;
        case 'Reverse XOR':
          decrypted[key] = tryReverseXOR(value, secret);
          break;
        default:
          decrypted[key] = value;
      }
    } catch (error) {
      decrypted[key] = `❌ Failed: ${error.message}`;
    }
  });
  
  return decrypted;
}

// Run the test
findDecryptionMethod();
