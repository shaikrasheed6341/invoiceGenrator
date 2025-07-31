import express from 'express';
import { validate, validateAsync, validateBusinessLogic } from '../middleware/validation.js';
import {
  userRegistrationSchema,
  userLoginSchema,
  ownerSchema,
  customerSchema,
  itemSchema,
  quotationSchema,
  bankDetailsSchema,
  phoneParamSchema,
  idParamSchema,
  searchQuerySchema,
  paginationSchema,
  updateOwnerSchema,
  updateCustomerSchema,
  updateItemSchema
} from '../validations/schemas.js';

const router = express.Router();

// Example 1: User Registration with validation
router.post('/register', validate(userRegistrationSchema), async (req, res) => {
  // req.body is now validated and contains only valid data
  const { firstname, lastname, email, password } = req.body;
  
  // Your business logic here
  res.json({ message: 'User registered successfully', data: { firstname, lastname, email } });
});

// Example 2: User Login with validation
router.post('/login', validate(userLoginSchema), async (req, res) => {
  const { email, password } = req.body;
  
  // Your login logic here
  res.json({ message: 'Login successful' });
});

// Example 3: Create Owner with validation
router.post('/owners', validate(ownerSchema), async (req, res) => {
  const ownerData = req.body;
  
  // Your owner creation logic here
  res.json({ message: 'Owner created successfully', data: ownerData });
});

// Example 4: Update Owner with partial validation
router.put('/owners/:id', 
  validate(idParamSchema, 'params'),
  validate(updateOwnerSchema),
  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Your update logic here
    res.json({ message: 'Owner updated successfully', id, data: updateData });
  }
);

// Example 5: Create Customer with validation
router.post('/customers', validate(customerSchema), async (req, res) => {
  const customerData = req.body;
  
  // Your customer creation logic here
  res.json({ message: 'Customer created successfully', data: customerData });
});

// Example 6: Update Customer by phone with validation
router.put('/customers/:phone', 
  validate(phoneParamSchema, 'params'),
  validate(updateCustomerSchema),
  async (req, res) => {
    const { phone } = req.params;
    const updateData = req.body;
    
    // Your update logic here
    res.json({ message: 'Customer updated successfully', phone, data: updateData });
  }
);

// Example 7: Create Item with validation
router.post('/items', validate(itemSchema), async (req, res) => {
  const itemData = req.body;
  
  // Your item creation logic here
  res.json({ message: 'Item created successfully', data: itemData });
});

// Example 8: Update Item with validation
router.put('/items/:id',
  validate(idParamSchema, 'params'),
  validate(updateItemSchema),
  async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Your update logic here
    res.json({ message: 'Item updated successfully', id, data: updateData });
  }
);

// Example 9: Create Quotation with validation
router.post('/quotations', validate(quotationSchema), async (req, res) => {
  const quotationData = req.body;
  
  // Your quotation creation logic here
  res.json({ message: 'Quotation created successfully', data: quotationData });
});

// Example 10: Create Bank Details with validation
router.post('/bank-details', validate(bankDetailsSchema), async (req, res) => {
  const bankData = req.body;
  
  // Your bank details creation logic here
  res.json({ message: 'Bank details created successfully', data: bankData });
});

// Example 11: Search with query validation
router.get('/search', validate(searchQuerySchema, 'query'), async (req, res) => {
  const { query, limit } = req.query;
  
  // Your search logic here
  res.json({ message: 'Search results', query, limit });
});

// Example 12: Paginated results with validation
router.get('/items', validate(paginationSchema, 'query'), async (req, res) => {
  const { page, limit } = req.query;
  
  // Your pagination logic here
  res.json({ message: 'Paginated results', page, limit });
});

// Example 13: Async validation for complex business logic
const validateCustomerExists = async (req) => {
  const { phone } = req.params;
  
  // Simulate database check
  const customerExists = await checkCustomerInDatabase(phone);
  
  if (!customerExists) {
    return {
      success: false,
      message: 'Customer not found',
      errors: [{ field: 'phone', message: 'Customer with this phone number does not exist' }]
    };
  }
  
  return { success: true };
};

router.get('/customers/:phone/details',
  validate(phoneParamSchema, 'params'),
  validateAsync(validateCustomerExists),
  async (req, res) => {
    const { phone } = req.params;
    
    // Your customer details logic here
    res.json({ message: 'Customer details retrieved', phone });
  }
);

// Example 14: Business logic validation
const validateOwnerPermissions = (req) => {
  const { userId } = req.user; // Assuming user is set by auth middleware
  const { ownerId } = req.params;
  
  // Check if user has permission to access this owner's data
  if (userId !== ownerId) {
    throw new Error('You do not have permission to access this data');
  }
  
  return true;
};

router.get('/owners/:ownerId/analytics',
  validate(idParamSchema, 'params'),
  validateBusinessLogic(validateOwnerPermissions, 'Access denied'),
  async (req, res) => {
    const { ownerId } = req.params;
    
    // Your analytics logic here
    res.json({ message: 'Analytics retrieved', ownerId });
  }
);

// Example 15: Multiple validations on same route
router.post('/quotations/:customerId/items',
  validate(idParamSchema, 'params'), // Validate customerId parameter
  validate(quotationItemSchema), // Validate request body
  async (req, res) => {
    const { customerId } = req.params;
    const itemData = req.body;
    
    // Your logic here
    res.json({ message: 'Item added to quotation', customerId, data: itemData });
  }
);

// Example 16: Custom sanitization before validation
const sanitizeCustomerData = (data) => {
  // Remove extra whitespace and convert to proper case
  return {
    ...data,
    name: data.name?.trim().replace(/\s+/g, ' '),
    phone: data.phone?.replace(/\D/g, ''), // Remove non-digits
    city: data.city?.trim().toLowerCase(),
    state: data.state?.trim().toLowerCase()
  };
};

router.post('/customers/sanitized',
  validate(customerSchema, 'body', sanitizeCustomerData),
  async (req, res) => {
    const customerData = req.body; // This is now sanitized and validated
    
    // Your logic here
    res.json({ message: 'Customer created with sanitized data', data: customerData });
  }
);

// Helper function for async validation example
async function checkCustomerInDatabase(phone) {
  // Simulate database check
  return phone.startsWith('9'); // Mock logic
}

export default router; 