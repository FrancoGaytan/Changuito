import { useState } from 'react';
import {
  useFamily,
  useCreateFamily,
  useJoinFamily,
  useInviteQr,
  useRemoveMember,
} from '@/features/family/hooks/useFamily';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';
import { QrScanner } from '@/components/QrScanner';
import type { FamilyMember } from '@/types';
import { FamilyLoading } from './FamilyLoading';
import { NoFamilyState } from './NoFamilyState';
import { FamilyHeader } from './FamilyHeader';
import { FamilyMembers } from './FamilyMembers';
import { FamilyInvitePanel } from './FamilyInvitePanel';
import { FamilyQrModal } from './FamilyQrModal';

export function FamilyPage() {
  const { data: family, isLoading } = useFamily();
  const createFamily = useCreateFamily();
  const joinFamily = useJoinFamily();
  const { refetch: fetchQr, data: qrData } = useInviteQr();
  const removeMember = useRemoveMember();
  const { user, clearAuth } = useAuthStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateFamily = () => {
    if (!familyName.trim()) return;
    createFamily.mutate(familyName.trim(), {
      onSuccess: () => {
        setFamilyName('');
        setShowCreateModal(false);
      },
    });
  };

  const handleJoinWithCode = () => {
    if (!joinCode.trim()) return;
    joinFamily.mutate(joinCode.trim(), {
      onSuccess: () => {
        setJoinCode('');
        setShowJoinModal(false);
      },
    });
  };

  const handleShowQr = () => {
    fetchQr();
    setShowQrModal(true);
  };

  const handleCopyCode = () => {
    if (family?.inviteCode) {
      navigator.clipboard.writeText(family.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQrScan = (data: string) => {
    setShowScanner(false);
    const match = data.match(/\/join\/([A-Za-z0-9]+)/);
    const code = match ? match[1] : data;
    joinFamily.mutate(code);
  };

  if (!isLoading && !family) {
    return (
      <NoFamilyState
        showCreateModal={showCreateModal}
        showJoinModal={showJoinModal}
        showScanner={showScanner}
        familyName={familyName}
        joinCode={joinCode}
        isCreatePending={createFamily.isPending}
        isJoinPending={joinFamily.isPending}
        isJoinError={joinFamily.isError}
        setFamilyName={setFamilyName}
        setJoinCode={setJoinCode}
        setShowCreateModal={setShowCreateModal}
        setShowJoinModal={setShowJoinModal}
        setShowScanner={setShowScanner}
        onCreateFamily={handleCreateFamily}
        onJoinWithCode={handleJoinWithCode}
        onQrScan={handleQrScan}
      />
    );
  }

  if (isLoading) {
    return <FamilyLoading />;
  }

  const isAdmin = family?.members.find((m: FamilyMember) => m.id === user?.id)?.role === 'admin';

  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
      <FamilyHeader
        familyName={family?.name}
        memberCount={family?.members.length}
        onInviteClick={handleShowQr}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FamilyMembers
          members={family?.members ?? []}
          currentUserId={user?.id}
          isAdmin={isAdmin}
          onRemoveMember={(memberId) => removeMember.mutate(memberId)}
        />

        <FamilyInvitePanel
          inviteCode={family?.inviteCode}
          copied={copied}
          onCopy={handleCopyCode}
          onShowQr={handleShowQr}
          onScanQr={() => setShowScanner(true)}
        />
      </div>

      {showQrModal && (
        <FamilyQrModal
          qrDataUrl={qrData?.qrDataUrl}
          code={qrData?.code}
          inviteCode={family?.inviteCode}
          copied={copied}
          onCopy={handleCopyCode}
          onClose={() => setShowQrModal(false)}
        />
      )}

      {showScanner && (
        <QrScanner
          onScan={handleQrScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Logout — mobile only, fixed just above the tab bar */}
      <div
        className="md:hidden fixed right-4 z-40"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom) + 0.75rem)' }}
      >
        <button
          onClick={clearAuth}
          className="flex items-center gap-2 text-xs text-stone-400 hover:text-red-500 transition-colors bg-white/80 backdrop-blur-sm shadow-sm rounded-full px-3 py-1.5 border border-stone-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
