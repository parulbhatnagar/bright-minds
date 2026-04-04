import type { SupabaseClient } from '@supabase/supabase-js';
import type { WordJarEntry, ModuleId } from '@study-aid/types';

export interface AddWordParams {
  childId: string;
  word: string;
  definition: string;
  childSentence?: string;
  imageUrl?: string;
  sourceModule: ModuleId;
}

export async function addWord(
  supabase: SupabaseClient,
  params: AddWordParams,
): Promise<WordJarEntry> {
  const { data, error } = await supabase
    .from('word_jar')
    .insert({
      child_id: params.childId,
      word: params.word,
      definition: params.definition,
      child_sentence: params.childSentence,
      image_url: params.imageUrl,
      source_module: params.sourceModule,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add word: ${error.message}`);
  return rowToWordJarEntry(data);
}

export async function getWordJar(
  supabase: SupabaseClient,
  childId: string,
): Promise<WordJarEntry[]> {
  const { data, error } = await supabase
    .from('word_jar')
    .select()
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to get word jar: ${error.message}`);
  return (data ?? []).map(rowToWordJarEntry);
}

function rowToWordJarEntry(row: Record<string, unknown>): WordJarEntry {
  return {
    id: row.id as string,
    childId: row.child_id as string,
    word: row.word as string,
    definition: row.definition as string,
    childSentence: row.child_sentence as string | undefined,
    imageUrl: row.image_url as string | undefined,
    sourceModule: row.source_module as ModuleId,
    createdAt: row.created_at as string,
  };
}
