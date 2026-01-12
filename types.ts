
export type TemplateId = 'classic' | 'modern' | 'floral' | 'luxury';

export interface GalleryImage {
  id: string;
  url: string;
}

export interface BankAccount {
  name: string;
  bank: string;
  number: string;
}

export interface InvitationData {
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  date: string;
  time: string;
  location: string;
  locationDetail: string;
  address: string;
  welcomeMessage: string;
  templateId: TemplateId;
  images: GalleryImage[];
  locationImages: GalleryImage[];
  audioUrl?: string;
  parkingGuideEnabled: boolean;
  accounts: {
    groom: BankAccount[];
    bride: BankAccount[];
  };
}

export interface GroundingLink {
  title: string;
  uri: string;
}
