import type { CollectionAfterLoginHook } from 'payload';

export const afterLoginHook: CollectionAfterLoginHook = async ({ user, req }) => {
  console.log('afterLoginHook called for user:', user.email);

  try {
    const updatedUser = await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        lastLogin: new Date().toISOString(),
      },
      depth: 0,
    });

    console.log('lastLogin updated successfully:', updatedUser.lastLogin);

    // Return the updated user with the new lastLogin value
    return {
      ...user,
      lastLogin: updatedUser.lastLogin,
    };
  } catch (error) {
    console.error('Error updating lastLogin:', error);
  }

  return user;
};
