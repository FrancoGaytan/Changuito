import { Plus, UserPlus, Camera } from 'lucide-react';
import { QrScanner } from '@/components/QrScanner';
import { CreateFamilyModal } from './CreateFamilyModal';
import { JoinFamilyModal } from './JoinFamilyModal';
import { familyLocale } from '@/locale/familyLocale';

const l = familyLocale;

interface Props {
  showCreateModal: boolean;
  showJoinModal: boolean;
  showScanner: boolean;
  familyName: string;
  joinCode: string;
  isCreatePending: boolean;
  isJoinPending: boolean;
  isJoinError: boolean;
  setFamilyName: (v: string) => void;
  setJoinCode: (v: string) => void;
  setShowCreateModal: (v: boolean) => void;
  setShowJoinModal: (v: boolean) => void;
  setShowScanner: (v: boolean) => void;
  onCreateFamily: () => void;
  onJoinWithCode: () => void;
  onQrScan: (data: string) => void;
}

export function NoFamilyState({
  showCreateModal,
  showJoinModal,
  showScanner,
  familyName,
  joinCode,
  isCreatePending,
  isJoinPending,
  isJoinError,
  setFamilyName,
  setJoinCode,
  setShowCreateModal,
  setShowJoinModal,
  setShowScanner,
  onCreateFamily,
  onJoinWithCode,
  onQrScan,
}: Props) {
  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight mb-2">
        {l.noFamily.title}
      </h1>
      <p className="text-stone-500 text-sm mb-10">
        {l.noFamily.subtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Create */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
            <Plus className="w-7 h-7 text-emerald-700" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-1">{l.noFamily.create.title}</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            {l.noFamily.create.description}
          </p>
        </button>

        {/* Join with code */}
        <button
          onClick={() => setShowJoinModal(true)}
          className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
            <UserPlus className="w-7 h-7 text-blue-700" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-1">{l.noFamily.join.title}</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            {l.noFamily.join.description}
          </p>
        </button>

        {/* Scan QR */}
        <button
          onClick={() => setShowScanner(true)}
          className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md transition-all text-left group sm:col-span-2"
        >
          <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
            <Camera className="w-7 h-7 text-violet-700" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-1">{l.noFamily.scan.title}</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            {l.noFamily.scan.description}
          </p>
        </button>
      </div>

      {showCreateModal && (
        <CreateFamilyModal
          familyName={familyName}
          setFamilyName={setFamilyName}
          isPending={isCreatePending}
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateFamily}
        />
      )}

      {showJoinModal && (
        <JoinFamilyModal
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          isError={isJoinError}
          isPending={isJoinPending}
          onClose={() => setShowJoinModal(false)}
          onJoin={onJoinWithCode}
        />
      )}

      {showScanner && (
        <QrScanner
          onScan={onQrScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
