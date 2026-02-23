import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import OverviewClient from './OverviewClient';

export default async function SkillOverviewRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch the skill from Supabase
  const { data: skill, error: skillError } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', id)
    .single();

  if (skillError || !skill) {
    return notFound();
  }

  // 2. Fetch the modules for this skill
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('skill_id', skill.id)
    .order('step_order', { ascending: true });

  // 3. Format the data to match what the UI expects
  const formattedData = {
    id: skill.slug,
    title: skill.title,
    tagline: skill.tagline,
    estimatedTime: skill.estimated_time,
    progress: 0, // Overview is always 0%
    modules: modules?.map((mod) => ({
      id: mod.id,
      title: mod.title,
      description: mod.description,
    })) || []
  };

  return <OverviewClient data={formattedData} />;
}