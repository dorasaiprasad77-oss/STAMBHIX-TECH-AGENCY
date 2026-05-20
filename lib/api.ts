import type { User, Memory, MemoriesResponse, MemoryResponse, MemoryStats, TimelineResponse, WeeklyActivity, TypeDistribution, Collection, CollectionsResponse, CollectionResponse, UploadResponse, UploadMultipleResponse } from '@/types';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('memorychain_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Auth
  async register(name: string, email: string, password: string) {
    const data = await this.request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.token = data.token;
    localStorage.setItem('memorychain_token', data.token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = data.token;
    localStorage.setItem('memorychain_token', data.token);
    return data;
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string; resetUrl?: string; resetToken?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, token: string, password: string) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, password }),
    });
  }

  async getProfile() {
    return this.request<{ user: User }>('/auth/profile');
  }

  async updateProfile(data: { name?: string; preferences?: Record<string, unknown> }) {
    return this.request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('memorychain_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Memories
  async getMemories(params?: {
    page?: number;
    limit?: number;
    type?: string;
    tag?: string;
    favorite?: boolean;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<MemoriesResponse>(`/memories${query ? `?${query}` : ''}`);
  }

  async getMemory(id: string) {
    return this.request<MemoryResponse>(`/memories/${id}`);
  }

  async createMemory(data: {
    title: string;
    content: string;
    type?: string;
    tags?: string[];
    images?: string[];
  }) {
    return this.request<{ message: string; memory: Memory }>('/memories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMemory(id: string, data: Partial<{
    title: string;
    content: string;
    type: string;
    tags: string[];
    favorite: boolean;
    images: string[];
  }>) {
    return this.request<{ message: string; memory: Memory }>(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMemory(id: string) {
    return this.request<{ message: string }>(`/memories/${id}`, {
      method: 'DELETE',
    });
  }

  async analyzeMemory(id: string) {
    return this.request<{ message: string; analysis: { summary: string; tags: string[] } }>(`/memories/${id}/analyze`, {
      method: 'POST',
    });
  }

  // Memory stats & timeline
  async getMemoryStats() {
    return this.request<MemoryStats>('/memories/stats');
  }

  async getMemoryTimeline() {
    return this.request<TimelineResponse>('/memories/timeline');
  }

  // Export
  async exportMemories(format: 'json' | 'csv' = 'json') {
    const response = await fetch(`/api/memories/export?format=${format}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memorychain-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Collections
  async getCollections() {
    return this.request<CollectionsResponse>('/collections');
  }

  async getCollection(id: string) {
    return this.request<CollectionResponse>(`/collections/${id}`);
  }

  async createCollection(data: { name: string; description?: string; color?: string }) {
    return this.request<{ message: string; collection: Collection }>('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCollection(id: string, data: { name?: string; description?: string; color?: string }) {
    return this.request<{ message: string; collection: Collection }>(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCollection(id: string) {
    return this.request<{ message: string }>(`/collections/${id}`, {
      method: 'DELETE',
    });
  }

  async addMemoriesToCollection(collectionId: string, memoryIds: string[]) {
    return this.request<{ message: string; collection: Collection }>(`/collections/${collectionId}/memories`, {
      method: 'POST',
      body: JSON.stringify({ memoryIds }),
    });
  }

  async removeMemoryFromCollection(collectionId: string, memoryId: string) {
    return this.request<{ message: string; collection: Collection }>(`/collections/${collectionId}/memories/${memoryId}`, {
      method: 'DELETE',
    });
  }

  // Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data as UploadResponse;
  }

  async uploadMultipleImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const response = await fetch(`/api/upload/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data as UploadMultipleResponse;
  }
}

export const api = new ApiClient();
