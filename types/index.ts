export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    aiEnabled: boolean;
  };
  createdAt: string;
}

export interface Memory {
  _id: string;
  user: string;
  title: string;
  content: string;
  type: 'text' | 'note' | 'journal' | 'idea' | 'reminder' | 'other';
  tags: string[];
  favorite: boolean;
  images?: string[];
  aiSummary?: string;
  aiTags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface MemoriesResponse {
  memories: Memory[];
  pagination: Pagination;
}

export interface MemoryResponse {
  memory: Memory;
}

export interface Collection {
  _id: string;
  user: string;
  name: string;
  description: string;
  color: string;
  memories: string[] | Memory[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionsResponse {
  collections: Collection[];
}

export interface CollectionResponse {
  collection: Collection;
}

export interface UploadResponse {
  message: string;
  image: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  };
}

export interface UploadMultipleResponse {
  message: string;
  images: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }[];
}

export interface MemoryStats {
  stats: {
    total: number;
    byType: Record<string, number>;
    favorites: number;
    recentWeek: number;
  };
}

export interface TimelineEntry {
  month: string;
  items: {
    id: string;
    title: string;
    type: string;
    date: string;
  }[];
  count: number;
}

export interface TimelineResponse {
  timeline: TimelineEntry[];
}

// Weekly activity data for charts
export interface WeeklyActivity {
  date: string;
  count: number;
  day: string;
}

// Type distribution for pie chart
export interface TypeDistribution {
  name: string;
  value: number;
  color: string;
}
