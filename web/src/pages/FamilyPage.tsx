import { useState } from 'react';
import {
  Plus,
  QrCode,
  Camera,
  Crown,
  Pencil,
  Eye,
  Trash2,
  Copy,
  Check,
  UserPlus,
} from 'lucide-react';
import {
  useFamily,
  useCreateFamily,
  useJoinFamily,
  useInviteQr,
  useRemoveMember,
} from '@/features/family/hooks/useFamily';
import { useAuthStore } from '@/store/authStore';
import { QrScanner } from '@/components/QrScanner';
import type { FamilyMember } from '@/types';

const roleConfig: Record<string, { icon: typeof Crown; label: string; color: string }> = {
  admin: { icon: Crown, label: 'Administrador', color: 'text-amber-600 bg-amber-50' },
  editor: { icon: Pencil, label: 'Editor', color: 'text-blue-600 bg-blue-50' },
  reader: { icon: Eye, label: 'Lector', color: 'text-stone-600 bg-stone-100' },
};

export function FamilyPage() {
  const { data: family, isLoading } = useFamily();
  const createFamily = useCreateFamily();
  const joinFamily = useJoinFamily();
  const { refetch: fetchQr, data: qrData } = useInviteQr();
  const removeMember = useRemoveMember();
  const user = useAuthStore((s) => s.user);

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
    // Extract code from URL like https://domain.com/join/CODE
    const match = data.match(/\/join\/([A-Za-z0-9]+)/);
    const code = match ? match[1] : data;
    joinFamily.mutate(code);
  };

  // ——— No family state ———
  if (!isLoading && !family) {
    return (
      <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight mb-2">
          Mi Familia
        </h1>
        <p className="text-stone-500 text-sm mb-10">
          Creá o unite a un grupo familiar para empezar a colaborar.
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
            <h3 className="text-lg font-bold text-stone-800 mb-1">Crear Grupo</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Armá tu grupo familiar y sumá integrantes con un código QR.
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
            <h3 className="text-lg font-bold text-stone-800 mb-1">Unirme con Código</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Ingresá el código de invitación que te compartieron.
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
            <h3 className="text-lg font-bold text-stone-800 mb-1">Escanear QR</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Abrí la cámara y escaneá el código del grupo para unirte automáticamente.
            </p>
          </button>
        </div>

        {/* Create modal */}
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <h2 className="text-xl font-bold text-[#1b5e20] mb-6">Crear Grupo Familiar</h2>
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
              Nombre del grupo
            </label>
            <input
              autoFocus
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Ej: Familia García"
              className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors mb-6"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFamily()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFamily}
                disabled={!familyName.trim() || createFamily.isPending}
                className="flex-1 py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                {createFamily.isPending ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </Modal>
        )}

        {/* Join modal */}
        {showJoinModal && (
          <Modal onClose={() => setShowJoinModal(false)}>
            <h2 className="text-xl font-bold text-[#1b5e20] mb-6">Unirme con Código</h2>
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">
              Código de invitación
            </label>
            <input
              autoFocus
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ej: A1B2C3D4"
              className="w-full bg-[#f4f5f5] border border-stone-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3.5 text-[15px] text-stone-800 placeholder:text-stone-400 outline-none transition-colors mb-2 uppercase tracking-widest text-center font-mono font-bold"
              onKeyDown={(e) => e.key === 'Enter' && handleJoinWithCode()}
            />
            {joinFamily.isError && (
              <p className="text-red-500 text-[12px] text-center mb-4">
                Código inválido o ya pertenecés a un grupo.
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleJoinWithCode}
                disabled={!joinCode.trim() || joinFamily.isPending}
                className="flex-1 py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                {joinFamily.isPending ? 'Uniéndome...' : 'Unirme'}
              </button>
            </div>
          </Modal>
        )}

        {/* QR Scanner */}
        {showScanner && (
          <QrScanner
            onScan={handleQrScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    );
  }

  // ——— Loading ———
  if (isLoading) {
    return (
      <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
        <div className="h-8 bg-stone-200 rounded w-1/3 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-stone-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-stone-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ——— Family exists ———
  const isAdmin = family?.members.find((m: FamilyMember) => m.id === user?.id)?.role === 'admin';

  return (
    <div className="min-h-full px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
            {family?.name}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {family?.members.length} integrante{family?.members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleShowQr}
          className="flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-5 py-3 rounded-2xl text-sm transition-all active:scale-[.97] shadow-lg shadow-green-900/20"
        >
          <QrCode className="w-5 h-5" />
          <span className="hidden sm:inline">Invitar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-1">
            Integrantes
          </h2>
          {family?.members.map((member: FamilyMember) => {
            const cfg = roleConfig[member.role] || roleConfig.reader;
            const RoleIcon = cfg.icon;

            return (
              <div
                key={member.id}
                className="flex items-center bg-white rounded-2xl px-5 py-4 shadow-sm border border-stone-100 gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-200 border-2 border-emerald-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-emerald-800">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-stone-800 truncate">
                    {member.name}
                    {member.id === user?.id && (
                      <span className="text-stone-400 text-xs ml-2">(Vos)</span>
                    )}
                  </p>
                  <p className="text-xs text-stone-400 truncate">{member.email}</p>
                </div>

                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide ${cfg.color}`}
                >
                  <RoleIcon className="w-3.5 h-3.5" />
                  {cfg.label}
                </span>

                {isAdmin && member.id !== user?.id && (
                  <button
                    onClick={() => removeMember.mutate(member.id)}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Invite panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-stone-800">Invitar</h3>
            </div>

            <div className="bg-[#f4f5f5] rounded-2xl p-4 mb-4">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
                Código de invitación
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-stone-800 tracking-widest">
                  {family?.inviteCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="w-8 h-8 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleShowQr}
              className="w-full bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold py-3 rounded-2xl text-sm transition-all shadow-lg shadow-green-900/20"
            >
              Mostrar QR
            </button>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="w-full bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-violet-700" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-stone-800">Escanear QR</p>
              <p className="text-xs text-stone-400">Unite a otro grupo</p>
            </div>
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <Modal onClose={() => setShowQrModal(false)}>
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#1b5e20] mb-2">
              Código QR del grupo
            </h2>
            <p className="text-stone-500 text-sm mb-6">
              Compartí este código o escanealo para unirte.
            </p>
            {qrData ? (
              <img
                src={qrData.qrDataUrl}
                alt="QR de invitación"
                className="w-64 h-64 mx-auto rounded-2xl shadow-lg mb-4"
              />
            ) : (
              <div className="w-64 h-64 mx-auto bg-stone-100 rounded-2xl animate-pulse mb-4" />
            )}
            <div className="bg-[#f4f5f5] rounded-xl px-4 py-3 inline-flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-stone-700 tracking-widest">
                {qrData?.code ?? family?.inviteCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="text-stone-500 hover:text-emerald-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* QR Scanner */}
      {showScanner && (
        <QrScanner
          onScan={handleQrScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

/* ——— Reusable Modal ——— */
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] w-full max-w-md p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 text-stone-400 transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
