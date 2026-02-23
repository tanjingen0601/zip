// app/skill/[id]/[moduleId]/summary/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import SummaryClient from './SummaryClient';

export default async function SummaryPageRoute({ params }: { params: Promise<{ id: string, moduleId: string }> }) {
  const { id, moduleId } = await params;
  const supabase = await createClient();

  // 1. Fetch the module ID based on the URL slug
  const { data: mod } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', moduleId)
    .single();

  if (!mod) return notFound();

  // 2. Fetch the Summary and its related Concepts
  const { data: summary } = await supabase
    .from('summaries')
    .select(`
      topic_tag,
      subject,
      title,
      key_takeaways,
      cheat_sheet,
      summary_concepts (
        icon, title, description, display_order
      )
    `)
    .eq('module_id', mod.id)
    .single();

  if (!summary) return notFound();

  // 3. Format the data for the Client Component
  // Sort concepts by display_order
  const sortedConcepts = (summary.summary_concepts || []).sort(
    (a: any, b: any) => a.display_order - b.display_order
  );

  const formattedData = {
    topicTag: summary.topic_tag,
    subject: summary.subject,
    title: summary.title,
    lastUpdated: "Just now", // In a real app, you'd format the updated_at timestamp here
    keyTakeaways: summary.key_takeaways,
    coreConcepts: sortedConcepts.map((concept: any) => ({
      icon: concept.icon,
      title: concept.title,
      description: concept.description
    })),
    cheatSheet: summary.cheat_sheet // Supabase automatically parses JSONB into a JS Object!
  };

  return <SummaryClient data={formattedData} />;
}