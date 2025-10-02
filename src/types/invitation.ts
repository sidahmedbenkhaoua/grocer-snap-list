export interface Invitation {
  id: string;
  groupId: string;
  groupName: string;
  groupDescription: string;
  invitedBy: string;
  invitedByName: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'refused';
}
