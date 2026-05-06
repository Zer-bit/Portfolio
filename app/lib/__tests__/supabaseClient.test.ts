import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('supabaseClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('throws when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-key');

    await expect(import('../supabaseClient')).rejects.toThrow('NEXT_PUBLIC_SUPABASE_URL');
  });

  it('throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');

    await expect(import('../supabaseClient')).rejects.toThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });
});
