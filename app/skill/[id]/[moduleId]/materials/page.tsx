// app/skill/[id]/[moduleId]/materials/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import MaterialsClient from './MaterialsClient';

export default async function MaterialsPageRoute({ params }: { params: Promise<{ id: string, moduleId: string }> }) {
  const { id, moduleId } = await params;
  const supabase = await createClient();

  // 1. Fetch the module ID based on the URL slug
  const { data: mod } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', moduleId)
    .single();

  if (!mod) return notFound();

  // 2. Fetch the Material and its Outline
  const { data: material } = await supabase
    .from('materials')
    .select(`
      title, part_text, duration, description, video_title, video_url,
      material_outlines ( id, label, sub_label, node_type, step_order )
    `)
    .eq('module_id', mod.id)
    .single();

  if (!material) return notFound();

  // 3. Format the data for the Client Component
  const sortedOutline = (material.material_outlines || []).sort((a: any, b: any) => a.step_order - b.step_order);

  const formattedData = {
    title: material.title,
    part: material.part_text,
    duration: material.duration,
    description: material.description,
    video: {
      title: material.video_title,
      url: material.video_url
    },
    outline: sortedOutline.map((item: any, index: number) => ({
      id: item.id,
      label: item.label,
      subLabel: item.sub_label,
      type: item.node_type,
      // Hardcoding visual state for the demo (normally this is tracked in user_progress)
      isCompleted: index === 0, 
      isActive: index === 1
    }))
  };

  return <MaterialsClient data={formattedData} skillId={id} moduleId={moduleId} />;
}