// app/skill/[id]/[moduleId]/flashcards/summary/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import FlashcardSummaryClient from './FlashcardSummaryClient';

export default async function FlashcardSummaryPageRoute({ params }: { params: Promise<{ id: string, moduleId: string }> }) {
  const { id, moduleId } = await params;
  const supabase = await createClient();

  // 1. Fetch the module ID based on the URL slug
  const { data: mod } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', moduleId)
    .single();

  if (!mod) return notFound();

  // 2. Fetch the Flashcard Set and the cards to display in the summary
  const { data: fcSet } = await supabase
    .from('flashcard_sets')
    .select(`
      title,
      flashcards (
        id, front, back
      )
    `)
    .eq('module_id', mod.id)
    .single();

  if (!fcSet || !fcSet.flashcards) {
    return notFound();
  }

  // 3. Format the data for the Client Component
  const formattedData = {
    title: fcSet.title,
    cards: fcSet.flashcards.map((card: any) => ({
      id: card.id,
      front: card.front,
      back: card.back // Maps to the PostgreSQL text[] array
    }))
  };

  return <FlashcardSummaryClient skillId={id} moduleId={moduleId} data={formattedData} />;
}