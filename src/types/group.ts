export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  code: string; // Code pour inviter des membres
  createdAt: string;
  members: Member[];
  createdBy: string;
}

export interface Purchase {
  id: string;
  purchasedBy: string;
  purchasedAt: string;
}

export interface PurchasePhoto {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}