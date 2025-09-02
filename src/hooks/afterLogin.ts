import type { CollectionAfterLoginHook } from 'payload';

export const afterLoginHook: CollectionAfterLoginHook = async ({ user, req }) => {
  try {
    await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        lastLogin: new Date().toISOString(),
      },
      depth: 0,
    });
  } catch (error) {
    console.error('Error updating lastLogin:', error);
  }

  return user;
};
