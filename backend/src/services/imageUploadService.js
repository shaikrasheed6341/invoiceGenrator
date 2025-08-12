import { uploadImage, getImageUrl, deleteImage } from '../config/supabase.js';

/**
 * Image Upload Service for Owner Images
 * Handles different types of image uploads to Supabase storage
 */

export class ImageUploadService {
  /**
   * Upload owner profile image
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} ownerId - Owner ID
   * @param {string} originalName - Original filename
   * @returns {Object} Upload result with URL
   */
  static async uploadOwnerProfileImage(imageBuffer, ownerId, originalName) {
    try {
      const fileExtension = this.getFileExtension(originalName);
      const fileName = `profile_${ownerId}_${Date.now()}${fileExtension}`;
      const folder = 'owner-profiles';
      
      await uploadImage(imageBuffer, folder, fileName);
      const publicUrl = getImageUrl(folder, fileName);
      
      return {
        success: true,
        fileName: fileName,
        publicUrl: publicUrl,
        folder: folder
      };
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw new Error('Failed to upload profile image');
    }
  }

  /**
   * Upload owner business logo
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} ownerId - Owner ID
   * @param {string} originalName - Original filename
   * @returns {Object} Upload result with URL
   */
  static async uploadBusinessLogo(imageBuffer, ownerId, originalName) {
    try {
      const fileExtension = this.getFileExtension(originalName);
      const fileName = `logo_${ownerId}_${Date.now()}${fileExtension}`;
      const folder = 'business-logos';
      
      await uploadImage(imageBuffer, folder, fileName);
      const publicUrl = getImageUrl(folder, fileName);
      
      return {
        success: true,
        fileName: fileName,
        publicUrl: publicUrl,
        folder: folder
      };
    } catch (error) {
      console.error('Business logo upload error:', error);
      throw new Error('Failed to upload business logo');
    }
  }

  /**
   * Upload owner document image (ID, license, etc.)
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} ownerId - Owner ID
   * @param {string} documentType - Type of document
   * @param {string} originalName - Original filename
   * @returns {Object} Upload result with URL
   */
  static async uploadOwnerDocument(imageBuffer, ownerId, documentType, originalName) {
    try {
      const fileExtension = this.getFileExtension(originalName);
      const fileName = `${documentType}_${ownerId}_${Date.now()}${fileExtension}`;
      const folder = 'owner-documents';
      
      await uploadImage(imageBuffer, folder, fileName);
      const publicUrl = getImageUrl(folder, fileName);
      
      return {
        success: true,
        fileName: fileName,
        publicUrl: publicUrl,
        folder: folder
      };
    } catch (error) {
      console.error('Document upload error:', error);
      throw new Error('Failed to upload document image');
    }
  }

  /**
   * Upload invoice template image
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} ownerId - Owner ID
   * @param {string} templateName - Template name
   * @param {string} originalName - Original filename
   * @returns {Object} Upload result with URL
   */
  static async uploadInvoiceTemplate(imageBuffer, ownerId, templateName, originalName) {
    try {
      const fileExtension = this.getFileExtension(originalName);
      const fileName = `${templateName}_${ownerId}_${Date.now()}${fileExtension}`;
      const folder = 'invoice-templates';
      
      await uploadImage(imageBuffer, folder, fileName);
      const publicUrl = getImageUrl(folder, fileName);
      
      return {
        success: true,
        fileName: fileName,
        publicUrl: publicUrl,
        folder: folder
      };
    } catch (error) {
      console.error('Invoice template upload error:', error);
      throw new Error('Failed to upload invoice template');
    }
  }

  /**
   * Delete image from storage
   * @param {string} folder - Folder path
   * @param {string} fileName - Filename to delete
   * @returns {boolean} Success status
   */
  static async deleteImage(folder, fileName) {
    try {
      await deleteImage(folder, fileName);
      return true;
    } catch (error) {
      console.error('Image deletion error:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Get public URL for an image
   * @param {string} folder - Folder path
   * @param {string} fileName - Filename
   * @returns {string} Public URL
   */
  static getImageUrl(folder, fileName) {
    return getImageUrl(folder, fileName);
  }

  /**
   * Extract file extension from filename
   * @param {string} filename - Original filename
   * @returns {string} File extension with dot
   */
  static getFileExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '.jpg';
  }

  /**
   * Validate image file
   * @param {Object} file - File object from multer
   * @returns {boolean} Validation result
   */
  static validateImageFile(file) {
    if (!file) return false;
    
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    return allowedMimeTypes.includes(file.mimetype);
  }

  /**
   * Generate unique filename
   * @param {string} prefix - Filename prefix
   * @param {string} ownerId - Owner ID
   * @param {string} originalName - Original filename
   * @returns {string} Unique filename
   */
  static generateUniqueFilename(prefix, ownerId, originalName) {
    const fileExtension = this.getFileExtension(originalName);
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${ownerId}_${timestamp}_${randomString}${fileExtension}`;
  }
}
