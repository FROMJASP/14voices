import type { CollectionConfig } from 'payload';

const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: {
      en: 'Category',
      nl: 'Categorie',
    },
    plural: {
      en: 'Categories',
      nl: 'Categorieën',
    },
  },
  admin: {
    useAsTitle: 'name',
    hidden: true, // Hide from sidebar navigation
    defaultColumns: ['name', 'icon', 'postsCount', 'updatedAt'],
    components: {
      beforeListTable: ['./components/admin/views/BlogPostsWithTabs#default'],
    },
    group: {
      en: 'Content',
      nl: 'Inhoud',
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: {
        en: 'Category Name',
        nl: 'Categorie Naam',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      label: {
        en: 'Icon',
        nl: 'Icoon',
      },
      options: [
        { label: 'Technology (CPU)', value: 'cpu' },
        { label: 'Business (Briefcase)', value: 'briefcase' },
        { label: 'Finance (Dollar)', value: 'dollar' },
        { label: 'Health (Heart Pulse)', value: 'health' },
        { label: 'Lifestyle (Book Heart)', value: 'lifestyle' },
        { label: 'Politics (Scale)', value: 'politics' },
        { label: 'Science (Flask)', value: 'science' },
        { label: 'Sports (Bike)', value: 'sports' },
        { label: 'Education (Graduation Cap)', value: 'education' },
        { label: 'Entertainment (Music)', value: 'entertainment' },
        { label: 'Food (Utensils)', value: 'food' },
        { label: 'Travel (Plane)', value: 'travel' },
        { label: 'Art (Palette)', value: 'art' },
        { label: 'Gaming (Gamepad)', value: 'gaming' },
        { label: 'Photography (Camera)', value: 'photography' },
      ],
      defaultValue: 'cpu',
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Description',
        nl: 'Beschrijving',
      },
      admin: {
        description: {
          en: 'Optional description for the category',
          nl: 'Optionele beschrijving voor de categorie',
        },
      },
    },
    {
      name: 'postsCount',
      type: 'number',
      virtual: true,
      label: {
        en: 'Posts Count',
        nl: 'Aantal Posts',
      },
      admin: {
        readOnly: true,
        description: {
          en: 'Number of blog posts in this category',
          nl: 'Aantal blogposts in deze categorie',
        },
      },
      hooks: {
        afterRead: [
          async ({ req, siblingData }) => {
            try {
              const { totalDocs } = await req.payload.find({
                collection: 'blog-posts',
                where: {
                  category: {
                    equals: siblingData.id,
                  },
                },
                limit: 0,
              });
              return totalDocs;
            } catch {
              return 0;
            }
          },
        ],
      },
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        const { totalDocs } = await req.payload.find({
          collection: 'blog-posts',
          where: {
            category: {
              equals: id,
            },
          },
          limit: 0,
        });

        if (totalDocs > 0) {
          throw new Error(
            `Cannot delete this category because it has ${totalDocs} blog post${
              totalDocs > 1 ? 's' : ''
            } associated with it. Please reassign or delete these posts first.`
          );
        }
      },
    ],
  },
};

export default Categories;
