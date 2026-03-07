import { describe, it, expect } from 'vitest';
import {
  searchSchema,
  playerIdSchema,
  sendConfirmationEmailSchema,
  aiRecapSchema,
  aiSummarySchema,
} from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('searchSchema', () => {
    it('validates valid search query', () => {
      const result = searchSchema.safeParse({ q: 'test' });
      expect(result.success).toBe(true);
    });

    it('rejects empty search query', () => {
      const result = searchSchema.safeParse({ q: '' });
      expect(result.success).toBe(false);
    });

    it('rejects single character search', () => {
      const result = searchSchema.safeParse({ q: 'a' });
      expect(result.success).toBe(false);
    });

    it('validates minimum 2 characters', () => {
      const result = searchSchema.safeParse({ q: 'ab' });
      expect(result.success).toBe(true);
    });

    it('rejects search query over 100 characters', () => {
      const result = searchSchema.safeParse({
        q: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('accepts search query at exactly 100 characters', () => {
      const result = searchSchema.safeParse({
        q: 'a'.repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it('trims whitespace from query', () => {
      const result = searchSchema.safeParse({ q: '  test  ' });
      if (result.success) {
        expect(result.data.q).toBe('test');
      }
    });

    it('validates optional type field', () => {
      const result = searchSchema.safeParse({ q: 'test', type: 'player' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid type', () => {
      const result = searchSchema.safeParse({ q: 'test', type: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('accepts player type', () => {
      const result = searchSchema.safeParse({ q: 'test', type: 'player' });
      expect(result.success).toBe(true);
    });

    it('accepts school type', () => {
      const result = searchSchema.safeParse({ q: 'test', type: 'school' });
      expect(result.success).toBe(true);
    });

    it('accepts coach type', () => {
      const result = searchSchema.safeParse({ q: 'test', type: 'coach' });
      expect(result.success).toBe(true);
    });
  });

  describe('playerIdSchema', () => {
    it('validates numeric ID', () => {
      const result = playerIdSchema.safeParse({ id: '123' });
      expect(result.success).toBe(true);
    });

    it('transforms string ID to number', () => {
      const result = playerIdSchema.safeParse({ id: '456' });
      if (result.success) {
        expect(result.data.id).toBe(456);
        expect(typeof result.data.id).toBe('number');
      }
    });

    it('rejects non-numeric ID', () => {
      const result = playerIdSchema.safeParse({ id: 'abc' });
      expect(result.success).toBe(false);
    });

    it('rejects empty ID', () => {
      const result = playerIdSchema.safeParse({ id: '' });
      expect(result.success).toBe(false);
    });

    it('rejects ID with spaces', () => {
      const result = playerIdSchema.safeParse({ id: '12 34' });
      expect(result.success).toBe(false);
    });

    it('rejects negative numbers in string format', () => {
      const result = playerIdSchema.safeParse({ id: '-123' });
      expect(result.success).toBe(false);
    });

    it('accepts leading zeros', () => {
      const result = playerIdSchema.safeParse({ id: '00123' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(123);
      }
    });

    it('rejects large non-numeric strings', () => {
      const result = playerIdSchema.safeParse({ id: '123abc456' });
      expect(result.success).toBe(false);
    });
  });

  describe('sendConfirmationEmailSchema', () => {
    it('validates valid email', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'test@example.com',
        token: 'token-123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'not-an-email',
        token: 'token-123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects email without domain', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'test@',
        token: 'token-123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects email without local part', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: '@example.com',
        token: 'token-123',
      });
      expect(result.success).toBe(false);
    });

    it('validates email with plus addressing', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'test+tag@example.com',
        token: 'token-123',
      });
      expect(result.success).toBe(true);
    });

    it('validates email with dots', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'test.user@example.com',
        token: 'token-123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty token', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'test@example.com',
        token: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing token', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('validates token with any content', () => {
      const result = sendConfirmationEmailSchema.safeParse({
        email: 'test@example.com',
        token: 'any-token-value-here',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('aiRecapSchema', () => {
    it('validates single game ID', () => {
      const result = aiRecapSchema.safeParse({ gameIds: ['1'] });
      expect(result.success).toBe(true);
    });

    it('validates multiple game IDs', () => {
      const result = aiRecapSchema.safeParse({ gameIds: ['1', '2', '3'] });
      expect(result.success).toBe(true);
    });

    it('rejects empty game IDs array', () => {
      const result = aiRecapSchema.safeParse({ gameIds: [] });
      expect(result.success).toBe(false);
    });

    it('rejects non-array gameIds', () => {
      const result = aiRecapSchema.safeParse({ gameIds: '123' });
      expect(result.success).toBe(false);
    });

    it('rejects non-numeric game ID', () => {
      const result = aiRecapSchema.safeParse({ gameIds: ['abc'] });
      expect(result.success).toBe(false);
    });

    it('rejects game ID with special characters', () => {
      const result = aiRecapSchema.safeParse({ gameIds: ['1#2'] });
      expect(result.success).toBe(false);
    });

    it('validates large game IDs', () => {
      const result = aiRecapSchema.safeParse({ gameIds: ['999999999'] });
      expect(result.success).toBe(true);
    });

    it('rejects missing gameIds', () => {
      const result = aiRecapSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('validates gameIds with leading zeros', () => {
      const result = aiRecapSchema.safeParse({ gameIds: ['00123'] });
      expect(result.success).toBe(true);
    });
  });

  describe('aiSummarySchema', () => {
    it('validates with title and body', () => {
      const result = aiSummarySchema.safeParse({
        title: 'Test Article',
        body: 'This is the article body',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty title', () => {
      const result = aiSummarySchema.safeParse({
        title: '',
        body: 'Body content',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty body', () => {
      const result = aiSummarySchema.safeParse({
        title: 'Title',
        body: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects title over 500 characters', () => {
      const result = aiSummarySchema.safeParse({
        title: 'a'.repeat(501),
        body: 'Body content',
      });
      expect(result.success).toBe(false);
    });

    it('accepts title at exactly 500 characters', () => {
      const result = aiSummarySchema.safeParse({
        title: 'a'.repeat(500),
        body: 'Body content',
      });
      expect(result.success).toBe(true);
    });

    it('accepts title at exactly 1 character', () => {
      const result = aiSummarySchema.safeParse({
        title: 'a',
        body: 'Body content',
      });
      expect(result.success).toBe(true);
    });

    it('rejects body over 50000 characters', () => {
      const result = aiSummarySchema.safeParse({
        title: 'Title',
        body: 'a'.repeat(50001),
      });
      expect(result.success).toBe(false);
    });

    it('accepts body at exactly 50000 characters', () => {
      const result = aiSummarySchema.safeParse({
        title: 'Title',
        body: 'a'.repeat(50000),
      });
      expect(result.success).toBe(true);
    });

    it('accepts body at exactly 1 character', () => {
      const result = aiSummarySchema.safeParse({
        title: 'Title',
        body: 'a',
      });
      expect(result.success).toBe(true);
    });

    it('validates with markdown content', () => {
      const result = aiSummarySchema.safeParse({
        title: '# Main Title',
        body: '## Section\nContent with **bold** and *italic*',
      });
      expect(result.success).toBe(true);
    });

    it('validates with special characters', () => {
      const result = aiSummarySchema.safeParse({
        title: 'Test © 2024',
        body: 'Content with émojis 🎉 and special chars!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing title', () => {
      const result = aiSummarySchema.safeParse({ body: 'Body' });
      expect(result.success).toBe(false);
    });

    it('rejects missing body', () => {
      const result = aiSummarySchema.safeParse({ title: 'Title' });
      expect(result.success).toBe(false);
    });

    it('validates with multiline content', () => {
      const result = aiSummarySchema.safeParse({
        title: 'Multi\nLine\nTitle',
        body: 'Line 1\nLine 2\nLine 3',
      });
      expect(result.success).toBe(true);
    });
  });
});
