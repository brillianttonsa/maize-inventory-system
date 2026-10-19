const pageParameters = [
  {
    name: 'page',
    in: 'query',
    required: false,
    description: '1-based page number. Supplying page or limit enables pagination.',
    schema: { type: 'integer', minimum: 1, default: 1 },
  },
  {
    name: 'limit',
    in: 'query',
    required: false,
    description: 'Records per page (maximum 100). Defaults to 20 when pagination is enabled.',
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
  },
];

const listResponse = {
  oneOf: [
    {
      type: 'array',
      items: { type: 'object', additionalProperties: true },
      description: 'Legacy response when neither page nor limit is provided.',
    },
    {
      type: 'object',
      required: ['items', 'total', 'page', 'limit', 'totalPages'],
      properties: {
        items: { type: 'array', items: { type: 'object', additionalProperties: true } },
        total: { type: 'integer', description: 'Total records matching the authenticated user.' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        totalPages: { type: 'integer' },
      },
    },
  ],
};

const jsonBody = (schemaName: string) => ({
  required: true,
  content: {
    'application/json': { schema: { $ref: `#/components/schemas/${schemaName}` } },
  },
});

const ok = (description: string) => ({
  '200': { description },
  '400': { description: 'Invalid request data' },
});

const uuidParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'uuid' },
};

const authenticated = [{ bearerAuth: [] }];

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Maize Inventory System API',
    description:
      'API for authentication, sales, expenses, procurement, production, inventory, and reports. Protected routes use JWT bearer authentication.',
    version: '4.0.0',
  },
  servers: [{ url: '/api/v4' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Signup: {
        type: 'object',
        required: ['name', 'username', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      Login: {
        type: 'object',
        required: ['username', 'password'],
        properties: { username: { type: 'string' }, password: { type: 'string' } },
      },
      Email: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string', format: 'email' } },
      },
      ResetPassword: {
        type: 'object',
        required: ['password'],
        properties: { password: { type: 'string', minLength: 6 } },
      },
      Sale: {
        type: 'object',
        required: [
          'customer_name', 'customer_contact', 'product_type', 'quantity',
          'price_per_kg', 'delivery_cost', 'delivery_address',
          'payment_method', 'total_amount', 'date',
        ],
        properties: {
          customer_name: { type: 'string' },
          customer_contact: { type: 'string' },
          product_type: { type: 'string', enum: ['flour', 'bran'] },
          quantity: { type: 'number' },
          sack_count: { type: 'integer' },
          sack_size: { type: 'integer', enum: [5, 10, 25] },
          bran_unit_count: { type: 'number' },
          bran_unit: { type: 'string', enum: ['gunia'] },
          price_per_kg: { type: 'number' },
          delivery_cost: { type: 'number' },
          delivery_address: { type: 'string' },
          payment_method: { type: 'string' },
          total_amount: { type: 'number' },
          date: { type: 'string', format: 'date' },
        },
      },
      Expense: {
        type: 'object',
        required: ['date', 'category', 'amount'],
        properties: {
          date: { type: 'string', format: 'date' },
          category: { type: 'string' },
          amount: { type: 'number' },
          unit_value: { type: 'number' },
          unit_cost: { type: 'number' },
          sack_size: { type: 'integer', enum: [5, 10, 25] },
          paid_by: { type: 'string' },
          method: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      Procurement: {
        type: 'object',
        required: ['supplier', 'quantity_tons', 'price_per_kg', 'transport_cost', 'total_cost', 'delivery_date'],
        properties: {
          supplier: { type: 'string' },
          quantity_tons: { type: 'number' },
          price_per_kg: { type: 'number' },
          transport_cost: { type: 'number' },
          total_cost: { type: 'number' },
          delivery_date: { type: 'string', format: 'date' },
        },
      },
      Production: {
        type: 'object',
        required: ['maize_tons', 'date'],
        properties: {
          maize_tons: { type: 'number' },
          flour_sacks_5kg: { type: 'integer' },
          flour_sacks_10kg: { type: 'integer' },
          flour_sacks_25kg: { type: 'integer' },
          bran_unit_count: { type: 'number' },
          bran_unit: { type: 'string', enum: ['gunia'] },
          date: { type: 'string', format: 'date' },
        },
      },
      Contact: {
        type: 'object',
        required: ['name', 'email', 'subject', 'message'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          subject: { type: 'string' },
          message: { type: 'string' },
        },
      },
      Report: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { type: 'string', enum: ['production', 'sales', 'procurement', 'financial'] },
        },
      },
      Profile: { type: 'object', additionalProperties: true, description: 'UpdateProfileDto fields.' },
      ChangePassword: { type: 'object', additionalProperties: true, description: 'ChangePasswordDto fields.' },
    },
  },
  paths: {
    '/': {
      get: { summary: 'API health greeting', responses: { '200': { description: 'API is running' } } },
    },
    '/auth/signup': {
      post: { summary: 'Register an account', requestBody: jsonBody('Signup'), responses: ok('Account created') },
    },
    '/auth/login': {
      post: { summary: 'Log in', requestBody: jsonBody('Login'), responses: ok('JWT access token and user') },
    },
    '/auth/forgot-password': {
      post: { summary: 'Request a password reset', requestBody: jsonBody('Email'), responses: ok('Reset request accepted') },
    },
    '/auth/reset-password/{token}': {
      post: {
        summary: 'Reset a password',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: jsonBody('ResetPassword'),
        responses: ok('Password reset'),
      },
    },
    '/sales': {
      get: {
        summary: 'List sales',
        description: 'Without pagination parameters, returns the legacy array response.',
        security: authenticated,
        parameters: pageParameters,
        responses: { '200': { description: 'Sales records', content: { 'application/json': { schema: listResponse } } } },
      },
      post: { summary: 'Create a sale', security: authenticated, requestBody: jsonBody('Sale'), responses: ok('Sale created') },
    },
    '/sales/{id}': {
      put: {
        summary: 'Update a sale', security: authenticated, parameters: [uuidParameter],
        requestBody: jsonBody('Sale'), responses: { ...ok('Sale updated'), '404': { description: 'Sale not found' } },
      },
      delete: {
        summary: 'Delete a sale', security: authenticated, parameters: [uuidParameter],
        responses: { '200': { description: 'Sale deleted' }, '404': { description: 'Sale not found' } },
      },
    },
    '/expenses': {
      get: {
        summary: 'List expenses', security: authenticated,
        parameters: [...pageParameters, { name: 'category', in: 'query', required: false, schema: { type: 'string' } }],
        responses: { '200': { description: 'Expense records', content: { 'application/json': { schema: listResponse } } } },
      },
      post: { summary: 'Create an expense', security: authenticated, requestBody: jsonBody('Expense'), responses: ok('Expense created') },
    },
    '/expenses/summary': {
      get: {
        summary: 'Get all-time expense totals grouped by category', security: authenticated,
        responses: { '200': { description: 'Expense totals grouped by category' } },
      },
    },
    '/expenses/{id}': {
      get: {
        summary: 'Get an expense', security: authenticated, parameters: [uuidParameter],
        responses: { '200': { description: 'Expense details' }, '404': { description: 'Expense not found' } },
      },
      put: {
        summary: 'Update an expense', security: authenticated, parameters: [uuidParameter],
        requestBody: jsonBody('Expense'), responses: { ...ok('Expense updated'), '404': { description: 'Expense not found' } },
      },
      delete: {
        summary: 'Delete an expense', security: authenticated, parameters: [uuidParameter],
        responses: { '200': { description: 'Expense deleted' }, '404': { description: 'Expense not found' } },
      },
    },
    '/procurement': {
      get: {
        summary: 'List procurement orders', security: authenticated, parameters: pageParameters,
        responses: { '200': { description: 'Procurement records', content: { 'application/json': { schema: listResponse } } } },
      },
      post: { summary: 'Create a procurement order', security: authenticated, requestBody: jsonBody('Procurement'), responses: ok('Order created') },
    },
    '/procurement/{id}': {
      put: {
        summary: 'Update a procurement order', security: authenticated, parameters: [uuidParameter],
        requestBody: jsonBody('Procurement'), responses: { ...ok('Order updated'), '404': { description: 'Order not found' } },
      },
      delete: {
        summary: 'Delete a procurement order', security: authenticated, parameters: [uuidParameter],
        responses: { '200': { description: 'Order deleted' }, '404': { description: 'Order not found' } },
      },
    },
    '/production': {
      get: {
        summary: 'List production batches', security: authenticated, parameters: pageParameters,
        responses: { '200': { description: 'Production records', content: { 'application/json': { schema: listResponse } } } },
      },
      post: { summary: 'Create a production batch', security: authenticated, requestBody: jsonBody('Production'), responses: ok('Batch created') },
    },
    '/production/chart-data': {
      get: {
        summary: 'Get daily production chart totals for a date range',
        security: authenticated,
        parameters: [
          { name: 'from', in: 'query', required: true, schema: { type: 'string', format: 'date' } },
          { name: 'to', in: 'query', required: true, schema: { type: 'string', format: 'date' } },
        ],
        responses: { '200': { description: 'Daily flour and bran totals for the selected range' } },
      },
    },
    '/production/{id}': {
      put: {
        summary: 'Update a production batch', security: authenticated, parameters: [uuidParameter],
        requestBody: jsonBody('Production'), responses: { ...ok('Batch updated'), '404': { description: 'Batch not found' } },
      },
      delete: {
        summary: 'Delete a production batch', security: authenticated, parameters: [uuidParameter],
        responses: { '200': { description: 'Batch deleted' }, '404': { description: 'Batch not found' } },
      },
    },
    '/inventory-movements': {
      get: {
        summary: 'List inventory movements with running balances',
        security: authenticated,
        parameters: [
          ...pageParameters,
          { name: 'item', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'source', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Inventory movements' } },
      },
    },
    '/recent-activities': {
      get: { summary: 'List six recent activities', security: authenticated, responses: { '200': { description: 'Recent activity records' } } },
    },
    '/dashboard-summary': {
      get: {
        summary: 'Get aggregated dashboard totals and current stock',
        security: authenticated,
        parameters: [{
          name: 'date', in: 'query', required: true,
          description: 'Local YYYY-MM-DD date used to total revenue for that day.',
          schema: { type: 'string', format: 'date' },
        }],
        responses: { '200': { description: 'Dashboard totals, sales revenue for the requested date, and stock balances' } },
      },
    },
    '/contact': {
      post: { summary: 'Submit a public contact message', requestBody: jsonBody('Contact'), responses: ok('Contact message received') },
    },
    '/settings/profile': {
      put: { summary: 'Update the authenticated profile', security: authenticated, requestBody: jsonBody('Profile'), responses: ok('Profile updated') },
    },
    '/settings/password': {
      put: { summary: 'Change the authenticated password', security: authenticated, requestBody: jsonBody('ChangePassword'), responses: ok('Password updated') },
    },
    '/reports/generate': {
      post: {
        summary: 'Generate a CSV report', security: authenticated, requestBody: jsonBody('Report'),
        responses: { '200': { description: 'CSV report', content: { 'text/csv': { schema: { type: 'string' } } } } },
      },
    },
    '/reports/comprehensive': {
      get: {
        summary: 'Download a comprehensive CSV report', security: authenticated,
        responses: { '200': { description: 'CSV report', content: { 'text/csv': { schema: { type: 'string' } } } } },
      },
    },
    '/reports/archive-and-reset': {
      post: {
        summary: 'Archive account data and reset records', security: authenticated,
        responses: { '200': { description: 'CSV archive' } },
      },
    },
  },
};
