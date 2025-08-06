import { describe, it, expect } from 'vitest';
import { ApiResponse, parsePaginationParams, createCacheKey } from '../api/handlers';
import { NextRequest, NextResponse } from 'next/server';

describe('ApiResponse', () => {
  it('should create a success response', () => {
    const data = { message: 'Success' };
    const response = ApiResponse.success(data);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });

  it('should create an error response', () => {
    const error = {
      message: 'Test error',
      status: 400,
      code: 'TEST_ERROR',
    };
    const response = ApiResponse.error(error);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);
  });

  it('should create a paginated response', () => {
    const data = [1, 2, 3];
    const total = 10;
    const params = { page: 1, limit: 3 };

    const response = ApiResponse.paginated(data, total, params);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });
});

describe('parsePaginationParams', () => {
  it('should parse pagination params from request', () => {
    const req = new NextRequest(
      'http://localhost:3000/api/test?page=2&limit=20&sort=name&order=desc'
    );
    const params = parsePaginationParams(req);

    expect(params).toEqual({
      page: 2,
      limit: 20,
      sort: 'name',
      order: 'desc',
    });
  });

  it('should use defaults when params are missing', () => {
    const req = new NextRequest('http://localhost:3000/api/test');
    const params = parsePaginationParams(req);

    expect(params).toEqual({
      page: 1,
      limit: 10,
      sort: undefined,
      order: 'asc',
    });
  });

  it('should enforce max limit', () => {
    const req = new NextRequest('http://localhost:3000/api/test?limit=200');
    const params = parsePaginationParams(req);

    expect(params.limit).toBe(100);
  });
});

describe('createCacheKey', () => {
  it('should create consistent cache keys', () => {
    const base = 'api:test';
    const params = { id: 1, name: 'test' };

    const key1 = createCacheKey(base, params);
    const key2 = createCacheKey(base, params);

    expect(key1).toBe(key2);
  });

  it('should filter out null and undefined values', () => {
    const base = 'api:test';
    const params = { id: 1, name: null, age: undefined };

    const key = createCacheKey(base, params);

    expect(key).toBe('api:test|id:1');
  });

  it('should sort parameters for consistency', () => {
    const base = 'api:test';
    const params1 = { b: 2, a: 1 };
    const params2 = { a: 1, b: 2 };

    const key1 = createCacheKey(base, params1);
    const key2 = createCacheKey(base, params2);

    expect(key1).toBe(key2);
  });
});
