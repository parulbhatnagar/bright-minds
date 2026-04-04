import type { SupabaseClient } from '@supabase/supabase-js';
import type { Session, ModuleId } from '@study-aid/types';

export async function createSession(
  supabase: SupabaseClient,
  childId: string,
  module: ModuleId,
): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ child_id: childId, module })
    .select()
    .single();

  if (error) throw new Error(`Failed to create session: ${error.message}`);
  return rowToSession(data);
}

export async function completeSession(
  supabase: SupabaseClient,
  sessionId: string,
  starsEarned: number,
): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update({ completed_at: new Date().toISOString(), stars_earned: starsEarned })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to complete session: ${error.message}`);
  return rowToSession(data);
}

export async function getSessions(
  supabase: SupabaseClient,
  childId: string,
  limit = 20,
): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select()
    .eq('child_id', childId)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to get sessions: ${error.message}`);
  return (data ?? []).map(rowToSession);
}

function rowToSession(row: Record<string, unknown>): Session {
  return {
    id: row.id as string,
    childId: row.child_id as string,
    module: row.module as ModuleId,
    startedAt: row.started_at as string,
    completedAt: (row.completed_at as string | null) ?? null,
    starsEarned: (row.stars_earned as number) ?? 0,
  };
}
