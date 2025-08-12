import crypto from 'crypto';

class EncryptionService {
  constructor() {
    // Use JWT secret as encryption key, fallback to a default if not available
    this.secretKey = process.env.JWT_SECRET || 'fallback-secret-key-for-encryption';
    this.algorithm = 'aes-256-cbc';
  }

  // Generate a consistent key from JWT secret
  generateKey() {
    return crypto.createHash('sha256').update(this.secretKey).digest();
  }

  // Encrypt sensitive data
  encrypt(text) {
    try {
      if (!text) return text;
      
      const iv = crypto.randomBytes(16);
      const key = this.generateKey();
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Return IV + encrypted data (IV is needed for decryption)
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return text; // Return original text if encryption fails
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedText) {
    try {
      if (!encryptedText) return encryptedText;
      
      // Check if the text is encrypted (contains IV separator)
      if (!encryptedText.includes(':')) {
        return encryptedText; // Not encrypted, return as is
      }
      
      const textParts = encryptedText.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedData = textParts.join(':');
      const key = this.generateKey();
      
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedText; // Return encrypted text if decryption fails
    }
  }

  // Encrypt an object's sensitive fields
  encryptObject(obj, sensitiveFields) {
    const encryptedObj = { ...obj };
    
    sensitiveFields.forEach(field => {
      if (encryptedObj[field] && typeof encryptedObj[field] === 'string') {
        encryptedObj[field] = this.encrypt(encryptedObj[field]);
      }
    });
    
    return encryptedObj;
  }

  // Decrypt an object's sensitive fields
  decryptObject(obj, sensitiveFields) {
    const decryptedObj = { ...obj };
    
    sensitiveFields.forEach(field => {
      if (decryptedObj[field] && typeof decryptedObj[field] === 'string') {
        decryptedObj[field] = this.decrypt(decryptedObj[field]);
      }
    });
    
    return decryptedObj;
  }

  // Encrypt bank details specifically
  encryptBankDetails(bankDetails) {
    const sensitiveFields = ['name', 'ifsccode', 'accountno', 'bank', 'upid', 'upidname'];
    return this.encryptObject(bankDetails, sensitiveFields);
  }

  // Decrypt bank details specifically
  decryptBankDetails(bankDetails) {
    const sensitiveFields = ['name', 'ifsccode', 'accountno', 'bank', 'upid', 'upidname'];
    return this.decryptObject(bankDetails, sensitiveFields);
  }

  // Encrypt customer details specifically
  encryptCustomerDetails(customer) {
    const sensitiveFields = ['name', 'phone', 'gstnumber', 'pannumber', 'recipientName', 'houseNumber', 'streetName', 'locality', 'city', 'pinCode', 'state'];
    return this.encryptObject(customer, sensitiveFields);
  }

  // Decrypt customer details specifically
  decryptCustomerDetails(customer) {
    const sensitiveFields = ['name', 'phone', 'gstnumber', 'pannumber', 'recipientName', 'houseNumber', 'streetName', 'locality', 'city', 'pinCode', 'state'];
    return this.decryptObject(customer, sensitiveFields);
  }

  // Encrypt owner details specifically
  encryptOwnerDetails(owner) {
    const sensitiveFields = ['name', 'email', 'phone', 'gstNumber', 'recipientName', 'houseNumber', 'streetName', 'locality', 'city', 'pinCode', 'state', 'compneyname'];
    return this.encryptObject(owner, sensitiveFields);
  }

  // Decrypt owner details specifically
  decryptOwnerDetails(owner) {
    const sensitiveFields = ['name', 'email', 'phone', 'gstNumber', 'recipientName', 'houseNumber', 'streetName', 'locality', 'city', 'pinCode', 'state', 'compneyname'];
    return this.decryptObject(owner, sensitiveFields);
  }
}

export default new EncryptionService();
