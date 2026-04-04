import { useState } from 'react';
import { useFeedback } from '@/context/FeedbackContext';
import { useLists, useCreateList, useDeleteList } from '@/features/lists/hooks/useLists';
import { useAppVisibility } from '@/hooks/useAppVisibility';
import { listsLocale } from '@/locale/listsLocale';
import { ListsHeader } from './ListsHeader';
import { CreateListModal } from './CreateListModal';
import { ListsLoading } from './ListsLoading';
import { ListsEmptyState } from './ListsEmptyState';
import { ListsGrid } from './ListsGrid';

const l = listsLocale;

export function ListsPage() {
  const { data: lists, isLoading } = useLists();
  const createList = useCreateList();
  const deleteList = useDeleteList();
  const { showFeedback } = useFeedback();
  useAppVisibility(['lists']);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTheme, setNewTheme] = useState('default');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createList.mutate(
      { name: newName.trim(), theme: newTheme },
      {
        onSuccess: () => {
          setNewName('');
          setNewTheme('default');
          setShowCreate(false);
          showFeedback({ type: 'success', message: l.feedback.created });
        },
        onError: () => {
          showFeedback({ type: 'error', message: l.feedback.createError });
        },
      },
    );
  };

  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
      <ListsHeader onAddClick={() => setShowCreate(true)} />

      {showCreate && (
        <CreateListModal
          newName={newName}
          setNewName={setNewName}
          newTheme={newTheme}
          setNewTheme={setNewTheme}
          isPending={createList.isPending}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {isLoading && <ListsLoading />}

      {!isLoading && (!lists || lists.length === 0) && (
        <ListsEmptyState onAddClick={() => setShowCreate(true)} />
      )}

      {lists && lists.length > 0 && (
        <ListsGrid
          lists={lists}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          onDeleteList={(id) => deleteList.mutate(id)}
        />
      )}
    </div>
  );
}
