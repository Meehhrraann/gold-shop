// types.ts

export interface IUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface IMessage {
  _id: string;
  content: string;
  sender: IUser;
  createdAt: string; // ISO date string
  readBy: string[];
  isUnread?: boolean; // Computed or from API
}

export interface IPagination {
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor: string | null;
  prevCursor: string | null;
  totalUnread: number;
}

export interface IFetchResponse {
  messages: IMessage[];
  pagination: IPagination;
}

// API Parameters
export interface IFetchParams {
  chatId: string;
  cursor?: string;
  limit?: number;
  direction?: "prev" | "next" | "initial";
  aroundUnread?: boolean;
}
