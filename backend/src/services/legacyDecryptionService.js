import crypto from 'crypto';

class LegacyDecryptionService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'fallback-secret-key-for-encryption';
  }

  // Try different decryption methods for legacy data
  decryptLegacy(encryptedText) {
    if (!encryptedText || !encryptedText.includes(':')) {
      return encryptedText; // Not encrypted
    }

    const methods = [
      () => this.tryAES256CBC(encryptedText),
      () => this.tryAES128CBC(encryptedText),
      () => this.tryLegacyCipher(encryptedText),
      () => this.trySimpleHash(encryptedText)
    ];

    for (const method of methods) {
      try {
        const result = method();
        if (result && result !== encryptedText) {
          return result;
        }
      } catch (error) {
        // Continue to next method
        continue;
      }
    }

    // If all methods fail, return the encrypted text
    return encryptedText;
  }

  // Method 1: Try AES-256-CBC with SHA256 hash
  tryAES256CBC(encryptedText) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    const key = crypto.createHash('sha256').update(this.secretKey).digest();
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Method 2: Try AES-128-CBC with MD5 hash (older method)
  tryAES128CBC(encryptedText) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    const key = crypto.createHash('md5').update(this.secretKey).digest();
    
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Method 3: Try legacy createCipher method (deprecated but might be what was used)
  tryLegacyCipher(encryptedText) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    
    // Try with different key lengths
    const keys = [
      this.secretKey,
      crypto.createHash('md5').update(this.secretKey).digest(),
      crypto.createHash('sha1').update(this.secretKey).digest().slice(0, 16)
    ];

    for (const key of keys) {
      try {
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        if (decrypted && decrypted.length > 0) {
          return decrypted;
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('Legacy cipher decryption failed');
  }

  // Method 4: Try simple XOR or other basic encryption
  trySimpleHash(encryptedText) {
    // This is a fallback for very basic encryption
    try {
      const textParts = encryptedText.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedData = textParts.join(':');
      
      // Try to reverse a simple XOR-like operation
      const keyBytes = Buffer.from(this.secretKey, 'utf8');
      const encryptedBuffer = Buffer.from(encryptedData, 'hex');
      
      let decrypted = '';
      for (let i = 0; i < encryptedBuffer.length; i++) {
        const keyByte = keyBytes[i % keyBytes.length];
        const encryptedByte = encryptedBuffer[i];
        decrypted += String.fromCharCode(encryptedByte ^ keyByte);
      }
      
      return decrypted;
    } catch (error) {
      throw new Error('Simple hash decryption failed');
    }
  }

  // Decrypt an object using legacy methods
  decryptObjectLegacy(obj, sensitiveFields) {
    const decryptedObj = { ...obj };
    
    sensitiveFields.forEach(field => {
      if (decryptedObj[field] && typeof decryptedObj[field] === 'string') {
        decryptedObj[field] = this.decryptLegacy(decryptedObj[field]);
      }
    });
    
    return decryptedObj;
  }
}

export default new LegacyDecryptionService();
