import { parseJsonField } from '@/lib/types/company';
import { recordActivity, ActivitySchema } from '@/lib/schema/activitySchema';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';

type ActivityType = z.infer<typeof ActivitySchema>['activity_type'];
type EntityType = z.infer<typeof ActivitySchema>['entity_type'];

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('Profile Utilities', () => {
  describe('parseJsonField', () => {
    it('parses valid JSON string', () => {
      const jsonString = '{"key": "value"}';
      const defaultValue = {};
      
      const result = parseJsonField(jsonString, defaultValue);
      
      expect(result).toEqual({ key: 'value' });
    });

    it('returns default value for invalid JSON string', () => {
      const invalidJson = 'invalid json';
      const defaultValue = { default: true };
      
      const result = parseJsonField(invalidJson, defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('returns default value for null input', () => {
      const nullInput = null;
      const defaultValue = { default: true };
      
      const result = parseJsonField(nullInput, defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('returns default value for undefined input', () => {
      const undefinedInput = undefined;
      const defaultValue = { default: true };
      
      const result = parseJsonField(undefinedInput, defaultValue);
      
      expect(result).toEqual(defaultValue);
    });

    it('handles nested JSON objects', () => {
      const jsonString = '{"nested": {"key": "value"}}';
      const defaultValue = {};
      
      const result = parseJsonField(jsonString, defaultValue);
      
      expect(result).toEqual({ nested: { key: 'value' } });
    });
  });

  describe('recordActivity', () => {
    const mockSupabase = {
      from: jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
      })),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
    });

    it('records profile update activity', async () => {
      const activityData = {
        user_id: 'test-user-id',
        activity_type: 'PROFILE_UPDATE' as ActivityType,
        entity_type: 'PROFILE' as EntityType,
        entity_id: 'test-profile-id',
        description: 'Updated profile information',
        metadata: {
          updated_fields: ['first_name', 'last_name'],
        },
      };

      await recordActivity(activityData);

      expect(mockSupabase.from).toHaveBeenCalledWith('activities');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        ...activityData,
        created_at: expect.any(String),
      });
    });

    it('records company update activity', async () => {
      const activityData = {
        user_id: 'test-user-id',
        activity_type: 'COMPANY_UPDATE' as ActivityType,
        entity_type: 'COMPANY' as EntityType,
        entity_id: 'test-company-id',
        description: 'Updated company information',
        metadata: {
          updated_fields: ['name', 'address'],
        },
      };

      await recordActivity(activityData);

      expect(mockSupabase.from).toHaveBeenCalledWith('activities');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        ...activityData,
        created_at: expect.any(String),
      });
    });

    it('handles activity recording errors', async () => {
      const mockError = new Error('Database error');
      const mockSupabaseWithError = {
        from: jest.fn(() => ({
          insert: jest.fn().mockRejectedValue(mockError),
        })),
      };
      (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabaseWithError);

      const activityData = {
        user_id: 'test-user-id',
        activity_type: 'PROFILE_UPDATE' as ActivityType,
        entity_type: 'PROFILE' as EntityType,
        entity_id: 'test-profile-id',
        description: 'Updated profile information',
        metadata: {},
      };

      await expect(recordActivity(activityData)).rejects.toThrow('Database error');
    });

    it('validates required activity fields', async () => {
      const invalidActivityData = {
        // Missing required fields
        description: 'Invalid activity data',
      };

      await expect(recordActivity(invalidActivityData as any)).rejects.toThrow();
    });
  });

  // Add more utility function tests as needed
}); 