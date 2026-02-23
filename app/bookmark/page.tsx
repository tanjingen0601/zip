// app/bookmark/page.tsx
import { createClient } from '@/utils/supabase/server';
import BookmarkClient from './BookmarkClient';

// Helper function to group the flat database rows into categories for the UI
function groupByCategory(data: any[]) {
  const groups: Record<string, any[]> = {};
  
  data.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push({
      id: item.id,
      title: item.title,
      module: item.module_name,
      link: item.link,
      type: item.type
    });
  });

  // Convert the grouped object into an array
  return Object.entries(groups).map(([category, items], index) => ({
    id: `cat-${index}`,
    category,
    items
  }));
}

export default async function BookmarkPage() {
  const supabase = await createClient();

  // Fetch all bookmarks from the database
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookmarks:', error);
  }

  // Format the data to match what the Client Component expects
  const groupedBookmarks = groupByCategory(bookmarks || []);

  return <BookmarkClient initialData={groupedBookmarks} />;
}