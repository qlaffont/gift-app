export enum Language {
  EN = 'EN',
  FR = 'FR',
}

export enum GiftListAccess {
  PASSWORD_PROTECTED = 'PASSWORD_PROTECTED',
  EMAIL = 'EMAIL',
  PUBLIC = 'PUBLIC',
}

export type GiftList = {
  id: string;
  name: string;
  description: string | null;
  resetTakenWhen: Date | null;
  access: GiftListAccess;
  password: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GiftListUserAccess = {
  ownerId: string;
  giftListId: string;
};

export type Gift = {
  id: string;
  name: string;
  description: string | null;
  link: string | null;
  coverUrl: string | null;
  takenById: string | null;
  takenWhen: Date | null;
  priority: number;
  order: number;
  giftListId: string;
  createdAt: Date;
  updatedAt: Date;
};
