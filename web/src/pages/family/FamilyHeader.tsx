import { QrCode } from 'lucide-react';
import { familyLocale } from '@/locale/familyLocale';

const l = familyLocale;

interface Props {
  familyName?: string;
  memberCount?: number;
  onInviteClick: () => void;
}

export function FamilyHeader({ familyName, memberCount, onInviteClick }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          {familyName}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {memberCount} {memberCount !== 1 ? l.header.memberPlural : l.header.memberSingular}
        </p>
      </div>
      <button
        onClick={onInviteClick}
        className="flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-5 py-3 rounded-2xl text-sm transition-all active:scale-[.97] shadow-lg shadow-green-900/20"
      >
        <QrCode className="w-5 h-5" />
        <span className="hidden sm:inline">{l.header.inviteButton}</span>
      </button>
    </div>
  );
}
