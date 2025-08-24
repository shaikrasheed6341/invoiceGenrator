import { ZodError } from 'zod';

/**
 * Middleware factory that creates validation middleware using Zod schemas
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {string} target - Where to validate ('body', 'params', 'query', or 'all')
 * @returns {Function} Express middleware function
 */
export const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    try {
      let dataToValidate;

      switch (target) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'all':
          dataToValidate = {
            body: req.body,
            params: req.params,
            query: req.query
          };
          break;
        default:
          dataToValidate = req.body;
      }

      // Validate the data
      const validatedData = schema.parse(dataToValidate);

      // Replace the original data with validated data
      switch (target) {
        case 'body':
          req.body = validatedData;
          break;
        case 'params':
          req.params = validatedData;
          break;
        case 'query':
          req.query = validatedData;
          break;
        case 'all':
          req.body = validatedData.body;
          req.params = validatedData.params;
          req.query = validatedData.query;
          break;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const formattedErrors = error.errors && Array.isArray(error.errors) 
          ? error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          : [{ field: 'unknown', message: 'Validation failed', code: 'VALIDATION_ERROR' }];

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
          errorType: 'VALIDATION_ERROR'
        });
      }

      // Handle other errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
        errorType: 'INTERNAL_ERROR'
      });
    }
  };
};

/**
 * Async validation middleware for complex validation logic
 * @param {Function} validator - Async function that returns validation result
 * @returns {Function} Express middleware function
 */
export const validateAsync = (validator) => {
  return async (req, res, next) => {
    try {
      const result = await validator(req);
      
      if (result.success === false) {
        return res.status(400).json({
          success: false,
          message: result.message || 'Validation failed',
          errors: result.errors || [],
          errorType: 'VALIDATION_ERROR'
        });
      }

      next();
    } catch (error) {
      console.error('Async validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
        errorType: 'INTERNAL_ERROR'
      });
    }
  };
};

/**
 * Custom validation for business logic
 * @param {Function} validator - Function that returns boolean or throws error
 * @param {string} errorMessage - Custom error message
 * @returns {Function} Express middleware function
 */
export const validateBusinessLogic = (validator, errorMessage = 'Business validation failed') => {
  return (req, res, next) => {
    try {
      const isValid = validator(req);
      
      if (isValid === false) {
        return res.status(400).json({
          success: false,
          message: errorMessage,
          errorType: 'BUSINESS_VALIDATION_ERROR'
        });
      }

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || errorMessage,
        errorType: 'BUSINESS_VALIDATION_ERROR'
      });
    }
  };
};

/**
 * Sanitize and validate data before processing
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {Function} sanitizer - Optional function to sanitize data before validation
 * @returns {Function} Express middleware function
 */
export const sanitizeAndValidate = (schema, sanitizer = null) => {
  return (req, res, next) => {
    try {
      let dataToValidate = req.body;

      // Apply sanitizer if provided
      if (sanitizer && typeof sanitizer === 'function') {
        dataToValidate = sanitizer(dataToValidate);
      }

      // Validate the data
      const validatedData = schema.parse(dataToValidate);
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors && Array.isArray(error.errors) 
          ? error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          : [{ field: 'unknown', message: 'Data validation failed', code: 'VALIDATION_ERROR' }];

        return res.status(400).json({
          success: false,
          message: 'Data validation failed',
          errors: formattedErrors,
          errorType: 'VALIDATION_ERROR'
        });
      }

      console.error('Sanitize and validate error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
        errorType: 'INTERNAL_ERROR'
      });
    }
  };
};

/**
 * Validate file uploads
 * @param {Object} options - File validation options
 * @returns {Function} Express middleware function
 */
export const validateFileUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles = 1
  } = options;

  return (req, res, next) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files were uploaded',
          errorType: 'FILE_VALIDATION_ERROR'
        });
      }

      const files = Array.isArray(req.files) ? req.files : Object.values(req.files);

      if (files.length > maxFiles) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxFiles} file(s) allowed`,
          errorType: 'FILE_VALIDATION_ERROR'
        });
      }

      for (const file of files) {
        // Check file size
        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            message: `File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
            errorType: 'FILE_VALIDATION_ERROR'
          });
        }

        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
            errorType: 'FILE_VALIDATION_ERROR'
          });
        }
      }

      next();
    } catch (error) {
      console.error('File validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during file validation',
        errorType: 'INTERNAL_ERROR'
      });
    }
  };
};

export default {
  validate,
  validateAsync,
  validateBusinessLogic,
  sanitizeAndValidate,
  validateFileUpload
}; 