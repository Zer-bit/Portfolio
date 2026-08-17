import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSupabaseConfigured, supabase } from '../supabaseClient';

describe('supabaseClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('detects when Supabase is not configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
    expect(isSupabaseConfigured()).toBe(false);
  });

  it('detects when Supabase is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test-ref.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key-12345');
    expect(isSupabaseConfigured()).toBe(true);
  });

  it('exports a valid client instance without throwing', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });
});
