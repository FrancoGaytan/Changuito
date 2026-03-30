export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'editor' | 'reader';
  joinedAt: string;
  status: 'active' | 'pending';
}

export interface FamilyGroup {
  id: string;
  name: string;
  inviteCode: string;
  members: FamilyMember[];
}
