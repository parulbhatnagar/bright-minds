import type { SupabaseClient } from '@supabase/supabase-js';
import type { ChildProfile, ModuleId, DifficultyLevel } from '@study-aid/types';

export async function getChildProfile(
  supabase: SupabaseClient,
  parentId: string,
): Promise<ChildProfile | null> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select()
    .eq('parent_id', parentId)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to get child profile: ${error.message}`);
  if (!data) return null;
  return rowToChildProfile(data);
}

export async function createChildProfile(
  supabase: SupabaseClient,
  params: { parentId: string; name: string; age: number; avatar?: string },
): Promise<ChildProfile> {
  const { data, error } = await supabase
    .from('child_profiles')
    .insert({
      parent_id: params.parentId,
      name: params.name,
      age: params.age,
      avatar: params.avatar ?? 'default',
      difficulty_level: 'simple',
      active_modules: ['picture-words'],
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create child profile: ${error.message}`);
  return rowToChildProfile(data);
}

function rowToChildProfile(row: Record<string, unknown>): ChildProfile {
  return {
    id: row.id as string,
    parentId: row.parent_id as string,
    name: row.name as string,
    age: row.age as number,
    avatar: row.avatar as string,
    difficultyLevel: row.difficulty_level as DifficultyLevel,
    activeModules: row.active_modules as ModuleId[],
    createdAt: row.created_at as string,
  };
}
