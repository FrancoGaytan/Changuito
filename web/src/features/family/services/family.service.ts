import { api } from '@/services/api';
import type { FamilyGroup, FamilyMember } from '@/types';

export const familyService = {
  getGroup: () => api.get<FamilyGroup>('/family'),

  create: (name: string) => api.post<FamilyGroup>('/family', { name }),

  inviteMember: (email: string) =>
    api.post<void>('/family/invite', { email }),

  removeMember: (memberId: string) =>
    api.delete<void>(`/family/members/${memberId}`),

  updateMemberRole: (memberId: string, role: FamilyMember['role']) =>
    api.patch<FamilyMember>(`/family/members/${memberId}`, { role }),

  getInviteQr: () => api.get<{ qrDataUrl: string; code: string }>('/family/invite-qr'),

  joinByCode: (code: string) => api.post<FamilyGroup>('/family/join', { code }),
};
