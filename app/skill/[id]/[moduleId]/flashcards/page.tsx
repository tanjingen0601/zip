// app/skill/[id]/[moduleId]/flashcards/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import FlashcardsClient from './FlashcardsClient';

export default async function FlashcardsPageRoute({ params }: { params: Promise<{ id: string, moduleId: string }> }) {
  const { id, moduleId } = await params;
  const supabase = await createClient();

  // 1. Fetch the module ID based on the URL slug
  const { data: mod } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', moduleId)
    .single();

  if (!mod) return notFound();

  // 2. Fetch the Flashcard Set and its related Flashcards using the module ID
  const { data: fcSet } = await supabase
    .from('flashcard_sets')
    .select(`
      id, 
      title,
      flashcards (
        id, tag, front, back
      )
    `)
    .eq('module_id', mod.id)
    .single();

  if (!fcSet || !fcSet.flashcards || fcSet.flashcards.length === 0) {
    return notFound(); // Show 404 if no flashcards exist for this module
  }

  // 3. Format the data for the Client Component
  const formattedData = {
    title: fcSet.title,
    cards: fcSet.flashcards.map((card: any) => ({
      id: card.id,
      tag: card.tag,
      front: card.front,
      back: card.back // This directly maps to our PostgreSQL text[] array
    }))
  };

  return <FlashcardsClient data={formattedData} skillId={id} moduleId={moduleId} />;
}