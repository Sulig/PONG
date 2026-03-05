// src/swaggerOptions.ts
import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pong API',
      version: '1.0.0',
      description: 'API documentation for the FT_Transcendence project',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'API Key authentication using Bearer token format: "Bearer YOUR_API_KEY"'
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token authentication via HTTP-only cookie (automatically set after login)'
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints (login, register, OAuth)'
      },
      {
        name: 'Profile',
        description: 'User profile management (requires JWT cookie)'
      },
      {
        name: 'Matches',
        description: 'Game matches and statistics (requires JWT cookie)'
      },
      {
        name: 'API Keys',
        description: 'API key management (requires JWT cookie)'
      },
      {
        name: 'Public',
        description: 'Public API endpoints (requires API key)'
      },
      {
        name: 'Friends',
        description: 'Friend requests and friendship management (requires JWT cookie)'
      }
    ]
  },

  apis: ['./src/routes/*.ts'],
};

export default options;