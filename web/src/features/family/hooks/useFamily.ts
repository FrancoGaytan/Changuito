import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { familyService } from '../services/family.service';

export function useFamily() {
  return useQuery({
    queryKey: ['family'],
    queryFn: () => familyService.getGroup().then((r) => r.data),
    refetchInterval: 1000 * 60, // cada 60s: refetch un nuevo familiar
  });
}

export function useCreateFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => familyService.create(name).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useJoinFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => familyService.joinByCode(code).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useInviteQr() {
  return useQuery({
    queryKey: ['family', 'invite-qr'],
    queryFn: () => familyService.getInviteQr().then((r) => r.data),
    enabled: false, // only fetch on demand
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => familyService.removeMember(memberId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useUpdateMemberRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      familyService.updateMemberRole(memberId, role as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['family'] }),
  });
}
