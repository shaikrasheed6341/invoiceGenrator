import express from 'express';
import { PrismaClient } from '@prisma/client';
import authmiddle from './authmiddleware.js';
import multer from 'multer';
import { ImageUploadService } from '../services/imageUploadService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (ImageUploadService.validateImageFile(file)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
  },
});

// Upload owner profile image
router.post('/profile', authmiddle, upload.single('profileImage'), async (req, res) => {
  try {
    const file = req.file;
    const ownerId = req.user.id;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload profile image
    const uploadResult = await ImageUploadService.uploadOwnerProfileImage(
      file.buffer,
      ownerId,
      file.originalname
    );

    // Update owner profile in database
    const updatedOwner = await prisma.owner.update({
      where: { id: ownerId },
      data: {
        profileImageUrl: uploadResult.publicUrl,
        profileImageFileName: uploadResult.fileName
      }
    });

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImageUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName
      }
    });

  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image',
      error: error.message
    });
  }
});

// Upload business logo
router.post('/logo', authmiddle, upload.single('logoImage'), async (req, res) => {
  try {
    const file = req.file;
    const ownerId = req.user.id;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload business logo
    const uploadResult = await ImageUploadService.uploadBusinessLogo(
      file.buffer,
      ownerId,
      file.originalname
    );

    // Update owner business info in database
    const updatedOwner = await prisma.owner.update({
      where: { id: ownerId },
      data: {
        businessLogoUrl: uploadResult.publicUrl,
        businessLogoFileName: uploadResult.fileName
      }
    });

    res.json({
      success: true,
      message: 'Business logo uploaded successfully',
      data: {
        businessLogoUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName
      }
    });

  } catch (error) {
    console.error('Business logo upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload business logo',
      error: error.message
    });
  }
});

// Upload owner document
router.post('/document', authmiddle, upload.single('documentImage'), async (req, res) => {
  try {
    const { documentType } = req.body;
    const file = req.file;
    const ownerId = req.user.id;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required'
      });
    }

    // Upload document image
    const uploadResult = await ImageUploadService.uploadOwnerDocument(
      file.buffer,
      ownerId,
      documentType,
      file.originalname
    );

    // Store document info in database (you might want to create a separate table for this)
    const documentRecord = await prisma.ownerDocument.create({
      data: {
        ownerId: ownerId,
        documentType: documentType,
        documentUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName,
        uploadedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documentId: documentRecord.id,
        documentUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName,
        documentType: documentType
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
});

// Upload invoice template image
router.post('/template', authmiddle, upload.single('templateImage'), async (req, res) => {
  try {
    const { templateName } = req.body;
    const file = req.file;
    const ownerId = req.user.id;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    if (!templateName) {
      return res.status(400).json({
        success: false,
        message: 'Template name is required'
      });
    }

    // Upload template image
    const uploadResult = await ImageUploadService.uploadInvoiceTemplate(
      file.buffer,
      ownerId,
      templateName,
      file.originalname
    );

    // Store template info in database
    const templateRecord = await prisma.invoiceTemplate.create({
      data: {
        ownerId: ownerId,
        name: templateName,
        templateImageUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName,
        createdAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Invoice template uploaded successfully',
      data: {
        templateId: templateRecord.id,
        templateImageUrl: uploadResult.publicUrl,
        fileName: uploadResult.fileName,
        templateName: templateName
      }
    });

  } catch (error) {
    console.error('Template upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload invoice template',
      error: error.message
    });
  }
});

// Delete image
router.delete('/:imageType/:fileName', authmiddle, async (req, res) => {
  try {
    const { imageType, fileName } = req.params;
    const ownerId = req.user.id;

    // Validate image type
    const validTypes = ['profile', 'logo', 'document', 'template'];
    if (!validTypes.includes(imageType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image type'
      });
    }

    // Delete from storage
    await ImageUploadService.deleteImage(imageType, fileName);

    // Update database accordingly
    let updateData = {};
    switch (imageType) {
      case 'profile':
        updateData = { profileImageUrl: null, profileImageFileName: null };
        break;
      case 'logo':
        updateData = { businessLogoUrl: null, businessLogoFileName: null };
        break;
      case 'document':
        // Delete from owner documents table
        await prisma.ownerDocument.deleteMany({
          where: { ownerId, fileName }
        });
        break;
      case 'template':
        // Delete from invoice templates table
        await prisma.invoiceTemplate.deleteMany({
          where: { ownerId, fileName }
        });
        break;
    }

    // Update owner record if needed
    if (Object.keys(updateData).length > 0) {
      await prisma.owner.update({
        where: { id: ownerId },
        data: updateData
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Get owner images info
router.get('/info', authmiddle, async (req, res) => {
  try {
    const ownerId = req.user.id;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
      select: {
        profileImageUrl: true,
        businessLogoUrl: true,
        profileImageFileName: true,
        businessLogoFileName: true
      }
    });

    // Get documents
    const documents = await prisma.ownerDocument.findMany({
      where: { ownerId },
      select: {
        id: true,
        documentType: true,
        documentUrl: true,
        fileName: true,
        uploadedAt: true
      }
    });

    // Get templates
    const templates = await prisma.invoiceTemplate.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        templateImageUrl: true,
        fileName: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: {
        profile: {
          url: owner.profileImageUrl,
          fileName: owner.profileImageFileName
        },
        logo: {
          url: owner.businessLogoUrl,
          fileName: owner.businessLogoFileName
        },
        documents: documents,
        templates: templates
      }
    });

  } catch (error) {
    console.error('Get images info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get images info',
      error: error.message
    });
  }
});

export default router;
