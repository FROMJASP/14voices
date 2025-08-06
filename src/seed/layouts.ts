export async function seedLayouts() {
  // The 'layouts' collection no longer exists in the current Payload configuration
  console.log('ℹ️  Layouts functionality has been disabled - collection does not exist');
  return;

  // Original code commented out as collection doesn't exist
  /*
  try {
    // Check if any layouts exist
    const existingLayouts = await payload.find({
      collection: 'layouts',
      limit: 1,
    });

    if (existingLayouts.docs.length > 0) {
      console.log('ℹ️  Layouts already exist, skipping seed');
      return existingLayouts.docs[0];
    }

    // ... rest of original implementation ...
  } catch (error) {
    console.error('Error seeding layouts:', error);
    throw error;
  }
  */
}
