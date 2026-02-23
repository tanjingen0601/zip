// app/skill/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import SkillDetailClient from './SkillDetailClient';

export default async function SkillDetailPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 'id' is the slug, e.g., 'database'
  const supabase = await createClient();

  // 1. Fetch the Skill
  const { data: skill, error: skillError } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', id)
    .single();

  if (skillError || !skill) return notFound();

  // 2. Fetch Modules and their Progress
  const { data: modulesData } = await supabase
    .from('modules')
    .select(`
      id, slug, title, description, step_order,
      user_progress ( status )
    `)
    .eq('skill_id', skill.id)
    .order('step_order', { ascending: true });

  const modules = modulesData || [];
  const totalModules = modules.length;

  let completedCount = 0;
  
  // 3. Format Modules & Calculate Progress
  const formattedModules = modules.map((mod, index) => {
    // If no progress record exists, default to 'locked'
    const status = mod.user_progress?.[0]?.status || 'locked';
    if (status === 'completed') completedCount++;

    // Dynamically generate the step labels (Start -> Step 2 -> Finish)
    let label = `Step ${index + 1}`;
    if (index === 0) label = 'Start';
    if (index === totalModules - 1 && totalModules > 1) label = 'Finish';

    return {
      id: mod.slug, // Pass the slug so the URL looks clean (e.g., /skill/database/sql-basics/materials)
      title: mod.title,
      description: mod.description,
      isLocked: status === 'locked',
      stepLabel: label
    };
  });

  // Determine how far the lightning bolt should travel
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  
  // Find the highest step the user has unlocked/reached
  let currentStepIndex = formattedModules.findIndex(m => m.isLocked);
  if (currentStepIndex === -1) currentStepIndex = totalModules - 1; // All unlocked

  // 4. Structure the data for the Client UI
  const formattedData = {
    id: skill.slug,
    title: skill.title,
    userCount: "1,234", // Placeholder until you add actual user accounts
    progressPercent,
    currentStepIndex,
    steps: formattedModules.map(m => ({ label: m.stepLabel, subLabel: m.title })),
    modules: formattedModules
  };

  return <SkillDetailClient data={formattedData} />;
}