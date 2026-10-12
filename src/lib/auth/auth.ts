import { APIError, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { resolveAddress } from '../address';
import { syncConsumerProfile } from '../consumer-profile';
import { prisma } from '../prisma';

export const auth = betterAuth({
  baseURL: { allowedHosts: ['http://localhost:3000', '*.netlify.app'] },
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  socialProviders: {},
  advanced: {
    database: { joins: true },
  },
  user: {
    additionalFields: {
      address: {
        type: 'string',
        required: true,
        input: true,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'CONSUMER',
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role == 'FARMER' ? 'FARMER' : 'CONSUMER';

          if (typeof user.address === 'string' && user.address.trim()) {
            const result = resolveAddress(user.address);
            if (!result.ok)
              throw new APIError('BAD_REQUEST', { message: result.error });
            return { data: { ...user, role, address: result.value.formatted } };
          }
          return { data: { ...user, role } };
        },

        after: async (user) => {
          if (user.role !== 'CONSUMER' || typeof user.address !== 'string')
            return;
          try {
            await syncConsumerProfile(user.id, user.address);
          } catch {
            // Not fatal: the dashboard recreates the profile from the saved address
          }
        },
      },
      update: {
        before: async (data) => {
          const { role, ...rest } = data;

          if (typeof rest.address === 'string') {
            const result = resolveAddress(rest.address);
            if (!result.ok)
              throw new APIError('BAD_REQUEST', { message: result.error });
            rest.address = result.value.formatted;
          }
          return { data: rest };
        },
      },
    },
  },
  
  plugins: [],
});
