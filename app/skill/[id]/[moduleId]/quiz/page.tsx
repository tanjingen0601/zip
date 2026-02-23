// app/skill/[id]/[moduleId]/quiz/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import QuizClient from './QuizClient';

export default async function QuizPageRoute({ params }: { params: Promise<{ id: string, moduleId: string }> }) {
  const { id, moduleId } = await params;
  const supabase = await createClient();

  // 1. Fetch the module ID based on the URL slug
  const { data: mod } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', moduleId)
    .single();

  if (!mod) return notFound();

  // 2. Fetch the Quiz and its related Questions using the module ID
  const { data: quiz } = await supabase
    .from('quizzes')
    .select(`
      id, 
      title,
      quiz_questions (
        id, question, options, correct_answer_index, explanation, hint, step_order
      )
    `)
    .eq('module_id', mod.id)
    .single();

  if (!quiz || !quiz.quiz_questions || quiz.quiz_questions.length === 0) {
    return notFound(); // Show 404 if no quiz exists for this module
  }

  // 3. Format the data for the Client Component
  // Sort questions by step_order to ensure they appear in the correct sequence
  const sortedQuestions = quiz.quiz_questions.sort((a: any, b: any) => a.step_order - b.step_order);

  const formattedData = {
    title: quiz.title,
    questions: sortedQuestions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options, // This directly maps to our PostgreSQL text array
      correctAnswerIndex: q.correct_answer_index,
      explanation: q.explanation,
      hint: q.hint
    }))
  };

  return <QuizClient data={formattedData} skillId={id} moduleId={moduleId} />;
}