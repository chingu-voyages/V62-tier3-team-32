import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { prisma } from '../prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  socialProviders: {},
  advanced: {
    database: { joins: true },
  },
  user: {
    additionalFields: {
      address: {
        type: "string",
        required: true,
        input: true
      },
      role: {
        type: "string",
        required: false,
        defaultValue: 'consumer',
        input: true
      }
    }
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role == 'FARMER' ? 'FARMER' : 'CONSUMER';
          return {data: {...user, role}}
        }
      }
    }
  },
  plugins: [],
});
