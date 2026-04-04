import { Crown, Pencil, Eye, Trash2 } from 'lucide-react';
import type { FamilyMember } from '@/types';
import { familyLocale } from '@/locale/familyLocale';

const l = familyLocale;

const roleConfig: Record<string, { icon: typeof Crown; label: string; color: string }> = {
  admin: { icon: Crown, label: l.members.roles.admin, color: 'text-amber-600 bg-amber-50' },
  editor: { icon: Pencil, label: l.members.roles.editor, color: 'text-blue-600 bg-blue-50' },
  reader: { icon: Eye, label: l.members.roles.reader, color: 'text-stone-600 bg-stone-100' },
};

interface Props {
  members: FamilyMember[];
  currentUserId?: string;
  isAdmin: boolean;
  onRemoveMember: (memberId: string) => void;
}

export function FamilyMembers({ members, currentUserId, isAdmin, onRemoveMember }: Props) {
  return (
    <div className="lg:col-span-2 space-y-3">
      <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-1 mb-1">
        {l.members.sectionTitle}
      </h2>
      {members.map((member: FamilyMember) => {
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
                {member.id === currentUserId && (
                  <span className="text-stone-400 text-xs ml-2">{l.members.you}</span>
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

            {isAdmin && member.id !== currentUserId && (
              <button
                onClick={() => onRemoveMember(member.id)}
                className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
