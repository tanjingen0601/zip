// app/progress/page.tsx
import { createClient } from '@/utils/supabase/server';
import ProgressClient from './ProgressClient';

export default async function ProgressPage() {
  const supabase = await createClient();

  // 1. Fetch skills, their modules, and the user's progress in one relational query
  const { data: skillsData, error } = await supabase
    .from('skills')
    .select(`
      id, 
      slug, 
      title, 
      icon,
      modules (
        id, 
        title, 
        step_order,
        user_progress (
          status, 
          percentage
        )
      )
    `);

  if (error) {
    console.error("Error fetching progress data:", error);
  }

  // 2. Format the raw database data into the structure your UI expects
  const formattedTracks = (skillsData || []).map((skill) => {
    // Sort modules by step_order
    const sortedModules = skill.modules.sort((a: any, b: any) => a.step_order - b.step_order);

    // Calculate overall progress percentage
    const totalModules = sortedModules.length;
    const completedModules = sortedModules.filter((m: any) => 
      m.user_progress?.[0]?.status === 'completed'
    ).length;
    
    const overallProgressPercent = totalModules > 0 
      ? Math.round((completedModules / totalModules) * 100) 
      : 0;

    return {
      id: skill.slug,
      title: skill.title,
      icon: skill.icon || 'Code2', // Fallback icon
      overallProgress: `${overallProgressPercent}% Complete`,
      skills: sortedModules.map((mod: any) => {
        // Since we don't have user auth yet, we grab the first progress record (or default to locked)
        const progress = mod.user_progress?.[0]; 
        
        return {
          id: mod.id,
          title: mod.title,
          status: progress?.status || 'locked',
          percentage: progress?.percentage ? `${progress.percentage}%` : undefined
        };
      })
    };
  });

  // 3. Pass the formatted data to the Client Component
  return <ProgressClient tracks={formattedTracks} />;
}