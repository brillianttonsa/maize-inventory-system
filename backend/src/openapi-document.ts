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
        items: {
          type: 'array',
          items: { type: 'object', additionalProperties: true },
        },
        total: { type: 'integer', description: 'Total records matching the authenticated user.' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        totalPages: { type: 'integer' },
      },
    },
  ],
};

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Maize Inventory System API',
    description:
      'Authenticated API for sales, expenses, procurement, and production. Collection routes accept optional bounded pagination.',
    version: '4.0.0',
  },
  servers: [{ url: '/api/v4' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/sales': {
      get: {
        summary: 'List sales',
        description: 'Without pagination parameters, returns the legacy array response.',
        security: [{ bearerAuth: [] }],
        parameters: pageParameters,
        responses: { '200': { description: 'Sales records', content: { 'application/json': { schema: listResponse } } } },
      },
    },
    '/expenses': {
      get: {
        summary: 'List expenses',
        security: [{ bearerAuth: [] }],
        parameters: pageParameters,
        responses: { '200': { description: 'Expense records', content: { 'application/json': { schema: listResponse } } } },
      },
    },
    '/procurement': {
      get: {
        summary: 'List procurement orders',
        security: [{ bearerAuth: [] }],
        parameters: pageParameters,
        responses: { '200': { description: 'Procurement records', content: { 'application/json': { schema: listResponse } } } },
      },
    },
    '/production': {
      get: {
        summary: 'List production batches',
        security: [{ bearerAuth: [] }],
        parameters: pageParameters,
        responses: { '200': { description: 'Production records', content: { 'application/json': { schema: listResponse } } } },
      },
    },
  },
};
