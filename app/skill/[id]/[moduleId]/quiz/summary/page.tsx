// app/skill/[id]/[moduleId]/quiz/summary/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import QuizSummaryClient from './QuizSummaryClient';

export default async function QuizSummaryPageRoute({ params }: { params: Promise<{ id: string, moduleId: string }> }) {
  const { id, moduleId } = await params;
  const supabase = await createClient();

  // 1. Fetch the module ID based on the URL slug
  const { data: mod } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', moduleId)
    .single();

  if (!mod) return notFound();

  // 2. Fetch the Quiz and count its questions
  const { data: quiz } = await supabase
    .from('quizzes')
    .select(`
      title,
      quiz_questions ( id )
    `)
    .eq('module_id', mod.id)
    .single();

  if (!quiz) return notFound();

  const totalQuestions = quiz.quiz_questions?.length || 0;

  // 3. Pass data to the Client UI
  return (
    <QuizSummaryClient 
      skillId={id} 
      moduleId={moduleId} 
      title={quiz.title} 
      totalQuestions={totalQuestions} 
    />
  );
}