import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../client';
import { qk } from '../keys';
import { NoteStatus } from '../../../types';
import type { Material, Comment, LeaderboardEntry, Paginated, MaterialQuery, Message, Conversation, Notification } from '../../../types';

// --- Materials ---

export function useMaterials(params?: MaterialQuery) {
  return useQuery({
    queryKey: qk.materials(params),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Material>>('/materials/', { params });
      return data; // Return full envelope for pagination
    },
  });
}

export function useMaterialsList(params?: MaterialQuery) {
  return useQuery({
    queryKey: qk.materials(params),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Material>>('/materials/', { params });
      return data.results;
    },
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: qk.material(id),
    queryFn: async () => {
      const { data } = await api.get<Material>(`/materials/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useMyMaterials() {
  return useQuery({
    queryKey: qk.myMaterials(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Material>>('/me/materials/');
      return data.results;
    },
  });
}

// Public materials authored by a specific user (any user, including the
// current one). Backed by /materials/?uploader=<id>&status=PUBLISHED via the
// uploader filter on MaterialFilter. Only PUBLISHED items are returned
// regardless of the requester's identity — same visibility rule the rest of
// the materials list enforces.
export function useUserMaterials(id?: string) {
  return useQuery({
    queryKey: qk.materials({ uploader: id, status: NoteStatus.PUBLISHED }),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Material>>('/materials/', {
        params: { uploader: id, status: NoteStatus.PUBLISHED },
      });
      return data.results;
    },
    enabled: !!id,
  });
}

// --- Comments ---

export function useComments(materialId: string) {
  return useQuery({
    queryKey: qk.comments(materialId),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Comment>>(`/materials/${materialId}/comments/`);
      return data.results;
    },
    enabled: !!materialId,
  });
}

// --- Leaderboard ---

export function useLeaderboard() {
  return useQuery({
    queryKey: qk.leaderboard(),
    queryFn: async () => {
      // Note: leaderboard is a bare array, not an envelope
      const { data } = await api.get<LeaderboardEntry[]>('/leaderboard/');
      return data;
    },
  });
}

// --- Moderation Queue ---

export function useModerationQueue(status?: NoteStatus) {
  return useQuery({
    queryKey: qk.moderationQueue(status),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Material>>('/moderation/materials/', {
        params: { status: status ?? 'PENDING' },
      });
      return data.results;
    },
  });
}

// --- Messages ---

export function useConversations() {
  return useQuery({
    queryKey: qk.conversations(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Conversation>>('/messages/conversations/');
      return data.results;
    },
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: qk.conversation(id),
    queryFn: async () => {
      const { data } = await api.get<Conversation>(`/messages/conversations/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const { data } = await api.post<Message>(`/messages/conversations/${conversationId}/messages/`, { content });
      return data;
    },
  });
}

// --- Notifications ---

export function useNotifications() {
  return useQuery({
    queryKey: qk.notifications(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Notification>>('/notifications/');
      return data.results;
    },
  });
}

export function useMarkNotificationRead() {
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.post(`/notifications/${notificationId}/read/`);
      return data;
    },
  });
}

export function useMarkAllNotificationsRead() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/notifications/read-all/');
      return data;
    },
  });
}