# 🔐 Data Encryption Security System

## Overview
This system implements AES-256-CBC encryption for all sensitive data before storing it in the database. The encryption key is derived from your JWT_SECRET environment variable, ensuring that even if someone gains access to your database, they cannot read the sensitive information without the encryption key.

## 🔒 What Gets Encrypted

### Bank Details
- Account holder name
- IFSC code
- Account number
- Bank name
- UPI ID
- UPI name

### Customer Information
- Customer name
- Phone number
- GST number
- PAN number
- Complete address (recipient name, house number, street, locality, city, pin code, state)

### Owner/Business Information
- Owner name
- Email
- Phone number
- GST number
- Company name
- Complete address

## 🚀 How to Use

### 1. Environment Setup
Make sure your `.env` file has a strong JWT_SECRET:
```env
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

### 2. Encrypt Existing Data
If you have existing data in your database that needs to be encrypted, run:
```bash
npm run encrypt-data
```

This script will:
- Check all existing records
- Encrypt any unencrypted sensitive data
- Skip already encrypted data
- Provide progress feedback

### 3. Automatic Encryption
All new data is automatically encrypted when:
- Creating new bank details
- Creating new customers
- Creating new owners
- Updating existing records

### 4. Automatic Decryption
All data is automatically decrypted when:
- Retrieving bank details
- Retrieving customer information
- Retrieving owner information
- Sending responses to the frontend

## 🛡️ Security Features

1. **AES-256-CBC Encryption**: Military-grade encryption algorithm
2. **Unique IV per Record**: Each encryption uses a unique initialization vector
3. **JWT Secret Integration**: Uses your existing JWT secret as the encryption key
4. **Automatic Handling**: No manual encryption/decryption needed in your code
5. **Backward Compatibility**: Existing unencrypted data is automatically detected and encrypted

## 🔍 How It Works

### Encryption Process
1. Generate a unique 16-byte IV (Initialization Vector)
2. Use AES-256-CBC with your JWT_SECRET as the key
3. Encrypt the sensitive data
4. Store IV + encrypted data in format: `iv:encrypted_data`

### Decryption Process
1. Split the stored data by ':' to separate IV and encrypted data
2. Use the IV and JWT_SECRET to decrypt the data
3. Return the original plain text

## 📝 Code Example

```javascript
// Data is automatically encrypted when storing
const bankDetails = await prisma.bankDetails.create({
  data: {
    name: "John Doe",           // Will be encrypted
    accountno: "1234567890",    // Will be encrypted
    bank: "State Bank",         // Will be encrypted
    // ... other fields
  }
});

// Data is automatically decrypted when retrieving
const retrieved = await prisma.bankDetails.findMany();
// All sensitive fields are now in plain text for the frontend
```

## ⚠️ Important Notes

1. **Backup Your JWT_SECRET**: If you lose this, you cannot decrypt your data
2. **Database Access**: Even with database access, encrypted data is unreadable without the key
3. **Performance**: Minimal performance impact due to efficient encryption algorithms
4. **Migration**: Run the encryption script after deploying to encrypt existing data

## 🚨 Security Best Practices

1. **Strong JWT Secret**: Use a long, random string for JWT_SECRET
2. **Environment Variables**: Never commit your .env file to version control
3. **Regular Updates**: Keep your dependencies updated for security patches
4. **Access Control**: Implement proper authentication and authorization
5. **Database Security**: Use database-level security features (firewalls, access controls)

## 🔧 Troubleshooting

### Data Not Encrypting
- Check if JWT_SECRET is set in your .env file
- Ensure the encryption service is properly imported
- Check console logs for encryption errors

### Data Not Decrypting
- Verify the data was encrypted in the first place
- Check if the JWT_SECRET has changed
- Look for decryption errors in console logs

### Performance Issues
- Encryption/decryption is very fast, but if you have thousands of records, consider pagination
- The system only encrypts/decrypts when necessary

## 📞 Support

If you encounter any issues with the encryption system:
1. Check the console logs for error messages
2. Verify your environment variables
3. Ensure all dependencies are installed
4. Run the encryption script to verify existing data

---

**Remember**: This encryption system significantly improves your data security, but it's just one layer of protection. Always implement proper authentication, authorization, and follow security best practices.
