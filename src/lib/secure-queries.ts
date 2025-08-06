import { getPayload } from '@/utilities/payload';
import type { Where } from 'payload';
import { validateInput } from '@/config/security';

/**
 * Secure query builder that prevents injection attacks
 */
export class SecureQueryBuilder {
  private conditions: Where[] = [];

  /**
   * Add an equals condition with input validation
   */
  equals(field: string, value: unknown): this {
    // Validate field name (alphanumeric, dots, and underscores only)
    if (!/^[a-zA-Z0-9._]+$/.test(field)) {
      throw new Error(`Invalid field name: ${field}`);
    }

    // Validate value based on type
    if (typeof value === 'string') {
      const validation = validateInput(value, {
        maxLength: 1000,
        stripHtml: true,
      });

      if (!validation.valid) {
        throw new Error(`Invalid value for field ${field}: ${validation.error}`);
      }

      value = validation.sanitized;
    }

    this.conditions.push({
      [field]: {
        equals: value,
      },
    });

    return this;
  }

  /**
   * Add a like condition with pattern validation
   */
  like(field: string, pattern: string): this {
    // Validate field name
    if (!/^[a-zA-Z0-9._]+$/.test(field)) {
      throw new Error(`Invalid field name: ${field}`);
    }

    // Validate and escape pattern
    const validation = validateInput(pattern, {
      maxLength: 100,
      stripHtml: true,
    });

    if (!validation.valid) {
      throw new Error(`Invalid pattern: ${validation.error}`);
    }

    // Escape special regex characters except % and _
    const escaped = validation.sanitized
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/%/g, '.*')
      .replace(/_/g, '.');

    this.conditions.push({
      [field]: {
        like: escaped,
      },
    });

    return this;
  }

  /**
   * Add an IN condition with array validation
   */
  in(field: string, values: unknown[]): this {
    // Validate field name
    if (!/^[a-zA-Z0-9._]+$/.test(field)) {
      throw new Error(`Invalid field name: ${field}`);
    }

    // Validate array size
    if (values.length > 100) {
      throw new Error('Too many values in IN clause');
    }

    // Validate each value
    const validatedValues = values.map((value) => {
      if (typeof value === 'string') {
        const validation = validateInput(value, {
          maxLength: 1000,
          stripHtml: true,
        });

        if (!validation.valid) {
          throw new Error(`Invalid value in array: ${validation.error}`);
        }

        return validation.sanitized;
      }
      return value;
    });

    this.conditions.push({
      [field]: {
        in: validatedValues,
      },
    });

    return this;
  }

  /**
   * Build the final where clause
   */
  build(): Where {
    if (this.conditions.length === 0) {
      return {};
    }

    if (this.conditions.length === 1) {
      return this.conditions[0];
    }

    return {
      and: this.conditions,
    };
  }
}

/**
 * Execute a secure query with proper error handling
 */
export async function secureQuery<T = any>(
  collection: string,
  queryBuilder: SecureQueryBuilder,
  options?: {
    limit?: number;
    page?: number;
    sort?: string;
    depth?: number;
  }
): Promise<{ docs: T[]; totalDocs: number; page: number }> {
  const payload = await getPayload();

  // Validate collection name
  if (!/^[a-zA-Z0-9-]+$/.test(collection)) {
    throw new Error(`Invalid collection name: ${collection}`);
  }

  // Validate options
  const safeOptions = {
    limit: Math.min(options?.limit || 10, 100),
    page: Math.max(options?.page || 1, 1),
    sort: options?.sort && /^-?[a-zA-Z0-9._]+$/.test(options.sort) ? options.sort : undefined,
    depth: Math.min(options?.depth || 0, 3),
  };

  try {
    const result = await payload.find({
      collection: collection as Parameters<typeof payload.find>[0]['collection'],
      where: queryBuilder.build(),
      limit: safeOptions.limit,
      page: safeOptions.page,
      sort: safeOptions.sort,
      depth: safeOptions.depth,
    } as Parameters<typeof payload.find>[0]);

    return {
      docs: result.docs as T[],
      totalDocs: result.totalDocs,
      page: result.page || 1,
    };
  } catch (error) {
    // Log error but don't expose internal details
    console.error(`Query error for collection ${collection}:`, error);
    throw new Error('Database query failed');
  }
}

/**
 * Execute a secure findByID with validation
 */
export async function secureFindByID<T = any>(
  collection: string,
  id: string,
  options?: {
    depth?: number;
  }
): Promise<T | null> {
  const payload = await getPayload();

  // Validate collection name
  if (!/^[a-zA-Z0-9-]+$/.test(collection)) {
    throw new Error(`Invalid collection name: ${collection}`);
  }

  // Validate ID format (assuming MongoDB ObjectID or UUID)
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    throw new Error('Invalid ID format');
  }

  try {
    const result = await payload.findByID({
      collection: collection as Parameters<typeof payload.findByID>[0]['collection'],
      id,
      depth: Math.min(options?.depth || 0, 3),
    } as Parameters<typeof payload.findByID>[0]);

    return result as T;
  } catch (error) {
    // Check if it's a not found error
    if (error instanceof Error && error.message.includes('not found')) {
      return null;
    }

    console.error(`FindByID error for ${collection}/${id}:`, error);
    throw new Error('Database query failed');
  }
}
