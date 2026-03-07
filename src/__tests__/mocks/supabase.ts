import { vi } from 'vitest';

/**
 * Mock Supabase client for testing.
 * Provides a chainable query builder pattern that matches Supabase's API.
 */

interface MockQueryResponse {
  data: any[] | any | null;
  error: Error | null;
}

class MockQueryBuilder {
  private tableName: string;
  private filters: Array<{ column: string; operator: string; value: any }> = [];
  private selectColumns: string = '*';
  private response: MockQueryResponse = { data: null, error: null };
  private singleMode: boolean = false;

  constructor(tableName: string, response?: MockQueryResponse) {
    this.tableName = tableName;
    this.response = response || { data: null, error: null };
  }

  select(columns: string = '*'): this {
    this.selectColumns = columns;
    return this;
  }

  eq(column: string, value: any): this {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column: string, value: any): this {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }

  gt(column: string, value: any): this {
    this.filters.push({ column, operator: 'gt', value });
    return this;
  }

  lt(column: string, value: any): this {
    this.filters.push({ column, operator: 'lt', value });
    return this;
  }

  gte(column: string, value: any): this {
    this.filters.push({ column, operator: 'gte', value });
    return this;
  }

  lte(column: string, value: any): this {
    this.filters.push({ column, operator: 'lte', value });
    return this;
  }

  in(column: string, values: any[]): this {
    this.filters.push({ column, operator: 'in', value: values });
    return this;
  }

  order(column: string, direction: 'asc' | 'desc' = 'asc'): this {
    // Order doesn't affect mock results in this simple implementation
    return this;
  }

  limit(count: number): this {
    // Limit doesn't affect mock results in this simple implementation
    return this;
  }

  single(): this {
    this.singleMode = true;
    return this;
  }

  async then<T = any, U = any>(
    onFulfilled?: ((value: MockQueryResponse) => T | PromiseLike<T>) | null,
    onRejected?: ((reason: any) => U | PromiseLike<U>) | null
  ): Promise<T | U> {
    const promise = Promise.resolve(this.response);
    return promise.then(onFulfilled, onRejected);
  }

  getFilters() {
    return this.filters;
  }

  getSelectColumns() {
    return this.selectColumns;
  }

  getTableName() {
    return this.tableName;
  }

  getResponse(): MockQueryResponse {
    return this.response;
  }
}

export class MockSupabaseClient {
  private mockResponses: Map<string, MockQueryResponse> = new Map();
  private queryHistory: Array<{
    table: string;
    filters: any[];
    columns: string;
    timestamp: number;
  }> = [];

  /**
   * Configure mock response for a specific table
   */
  setMockResponse(tableName: string, response: MockQueryResponse): void {
    this.mockResponses.set(tableName, response);
  }

  /**
   * Configure mock response for a specific query pattern
   */
  setMockResponseForQuery(
    tableName: string,
    column: string,
    value: any,
    response: MockQueryResponse
  ): void {
    const key = `${tableName}:${column}:${value}`;
    this.mockResponses.set(key, response);
  }

  /**
   * Set error response for a table
   */
  setError(tableName: string, error: Error): void {
    this.mockResponses.set(tableName, { data: null, error });
  }

  /**
   * Get query history for assertions
   */
  getQueryHistory() {
    return this.queryHistory;
  }

  /**
   * Clear query history
   */
  clearQueryHistory(): void {
    this.queryHistory = [];
  }

  /**
   * Main from() method that returns chainable query builder
   */
  from(tableName: string): MockQueryBuilder {
    const mockResponse = this.mockResponses.get(tableName) || {
      data: null,
      error: null,
    };

    const builder = new MockQueryBuilder(tableName, mockResponse);

    // Track query in history when methods are called
    const originalThen = builder.then.bind(builder);
    builder.then = function <T = any, U = any>(
      onFulfilled?: ((value: MockQueryResponse) => T | PromiseLike<T>) | null,
      onRejected?: ((reason: any) => U | PromiseLike<U>) | null
    ): Promise<T | U> {
      this.queryHistory?.push({
        table: builder.getTableName(),
        filters: builder.getFilters(),
        columns: builder.getSelectColumns(),
        timestamp: Date.now(),
      });
      return originalThen(onFulfilled, onRejected);
    }.bind(this);

    return builder;
  }

  /**
   * Reset all mocks
   */
  reset(): void {
    this.mockResponses.clear();
    this.queryHistory = [];
  }
}

/**
 * Factory function to create a mock Supabase client
 */
export function createMockSupabaseClient(): MockSupabaseClient {
  return new MockSupabaseClient();
}

/**
 * Create a fully configured mock Supabase client with common test data
 */
export function createMockSupabaseClientWithDefaults(): MockSupabaseClient {
  const client = new MockSupabaseClient();

  // Default empty responses for common tables
  client.setMockResponse('players', { data: [], error: null });
  client.setMockResponse('schools', { data: [], error: null });
  client.setMockResponse('teams', { data: [], error: null });
  client.setMockResponse('games', { data: [], error: null });
  client.setMockResponse('player_seasons', { data: [], error: null });

  return client;
}

/**
 * Mock Resend email client for testing
 */
export class MockResendClient {
  private sentEmails: Array<{
    to: string;
    subject: string;
    html?: string;
    text?: string;
    timestamp: number;
  }> = [];

  private errors: Map<string, Error> = new Map();

  /**
   * Configure error for specific recipient
   */
  setErrorForRecipient(email: string, error: Error): void {
    this.errors.set(email, error);
  }

  /**
   * Get all sent emails
   */
  getSentEmails() {
    return this.sentEmails;
  }

  /**
   * Get emails sent to specific recipient
   */
  getEmailsTo(email: string) {
    return this.sentEmails.filter((e) => e.to === email);
  }

  /**
   * Clear sent emails history
   */
  clearSentEmails(): void {
    this.sentEmails = [];
  }

  /**
   * Mock email sending
   */
  async send(options: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<{ id: string } | { error: Error }> {
    const error = this.errors.get(options.to);

    if (error) {
      return { error };
    }

    this.sentEmails.push({
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      timestamp: Date.now(),
    });

    return { id: `email-${Date.now()}` };
  }

  /**
   * Reset all mocks
   */
  reset(): void {
    this.sentEmails = [];
    this.errors.clear();
  }
}

/**
 * Factory function to create a mock Resend client
 */
export function createMockResendClient(): MockResendClient {
  return new MockResendClient();
}
