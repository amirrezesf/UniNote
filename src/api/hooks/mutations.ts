import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { qk } from '../keys';
import { getApiErrorMessage } from '../client';
import type { Material, MaterialDetail, MaterialType, Comment } from '../../../types';

const MATERIALS_URL = '/materials/';
const COMMENTS_URL = (materialId: string) => `/materials/${materialId}/comments/`;
const RATE_URL = (materialId: string) => `/materials/${materialId}/rate/`;
const LIKE_URL = (materialId: string) => `/materials/${materialId}/like/`;
const VIEW_URL = (materialId: string) => `/materials/${materialId}/view/`;
const UPLOAD_URL = '/materials/';
const MODERATION_APPROVE_URL = (materialId: string) => `/materials/${materialId}/approve/`;
const MODERATION_REJECT_URL = (materialId: string) => `/materials/${materialId}/reject/`;
const TEACHER_CLAIM_URL = (teacherId: string) => `/teachers/${teacherId}/claim/`;
const PROFILE_URL = '/auth/me/';

// --- Upload Material ---

export interface UploadMaterialInput {
  title: string;
  description: string;
  materialType: MaterialType;
  fieldId: string;
  courseId?: string;
  teacherId?: string;
  universityId?: string;
  term?: string;
  tags?: string[];
  file: File;
  // Marketplace fields — must match backend MaterialWriteSerializer
  isPremium?: boolean;
  priceTomans?: number;
}

export function useUploadMaterial() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: UploadMaterialInput) => {
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (value == null) return;
        if (key === 'tags' && Array.isArray(value)) {
          value.forEach((t) => formData.append('tags', t));
        } else {
          formData.append(key, value as string | Blob);
        }
      });
      const { data } = await api.post<Material>(UPLOAD_URL, formData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.myMaterials() });
      qc.invalidateQueries({ queryKey: ['materials'] });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- Update Material ---

export function useUpdateMaterial(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (update: Partial<Material>) => {
      // If avatar is a file, would use FormData, but material updates are JSON
      const { data } = await api.patch<Material>(`${MATERIALS_URL}${id}/`, update);
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(qk.material(id), data);
      qc.invalidateQueries({ queryKey: ['materials'] });
      qc.invalidateQueries({ queryKey: qk.myMaterials() });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- Delete Material ---

export function useDeleteMaterial(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`${MATERIALS_URL}${id}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.material(id) });
      qc.invalidateQueries({ queryKey: ['materials'] });
      qc.invalidateQueries({ queryKey: qk.myMaterials() });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- Rate Material ---

export function useRateMaterial(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (value: number) => {
      const { data } = await api.post<{ rating: number; myRating: number }>(RATE_URL(id), { value });
      return data;
    },
    onMutate: async (value) => {
      await qc.cancelQueries({ queryKey: qk.material(id) });
      const previous = qc.getQueryData<MaterialDetail>(qk.material(id));
      qc.setQueryData<MaterialDetail>(qk.material(id), (old) => old ? { ...old, rating: value, myRating: value } : old);
      return { previous };
    },
    onError: (err, _value, context) => {
      if (context?.previous) {
        qc.setQueryData(qk.material(id), context.previous);
      }
      throw new Error(getApiErrorMessage(err));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.material(id) });
    },
  });
}

// --- Toggle Like (Optimistic) ---

interface LikeResponse { likes: number; liked: boolean; }

export function useToggleLike(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<LikeResponse>(LIKE_URL(id));
      return data;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.material(id) });
      const previous = qc.getQueryData<MaterialDetail>(qk.material(id));
      // Optimistic update
      qc.setQueryData<MaterialDetail>(qk.material(id), (old) => {
        if (!old) return old;
        return {
          ...old,
          likes: old.liked ? old.likes - 1 : old.likes + 1,
          liked: !old.liked,
        };
      });
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(qk.material(id), context.previous);
      }
      throw new Error(getApiErrorMessage(err));
    },
    onSuccess: (serverData) => {
      // Reconcile with server response
      qc.setQueryData<MaterialDetail>(qk.material(id), (old) => {
        if (!old) return old;
        return {
          ...old,
          likes: serverData.likes,
          liked: serverData.liked,
        };
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.material(id) });
    },
  });
}

// --- Track View (fire once, guard against double-fire in StrictMode) ---

export function useTrackView(id: string) {
  const qc = useQueryClient();
  const firedRef = { current: false };

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ views: number }>(VIEW_URL(id));
      return data;
    },
    onMutate: () => {
      if (firedRef.current) return;
      firedRef.current = true;
    },
    onSuccess: (serverData) => {
      qc.setQueryData<MaterialDetail>(qk.material(id), (old) => {
        if (!old) return old;
        return { ...old, views: serverData.views };
      });
    },
  });
}

// --- Add Comment ---

export function useAddComment(materialId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post<Comment>(COMMENTS_URL(materialId), { content });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.comments(materialId) });
      qc.invalidateQueries({ queryKey: qk.material(materialId) });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- Approve Material (Staff) ---

export function useApproveMaterial(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<Material>(MODERATION_APPROVE_URL(id));
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.moderationQueue(undefined) });
      qc.invalidateQueries({ queryKey: qk.material(id) });
      qc.invalidateQueries({ queryKey: ['materials'] });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- Reject Material (Staff) ---

export function useRejectMaterial(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<Material>(MODERATION_REJECT_URL(id));
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.moderationQueue(undefined) });
      qc.invalidateQueries({ queryKey: qk.material(id) });
      qc.invalidateQueries({ queryKey: ['materials'] });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- Claim Teacher (Instructor) ---

export function useClaimTeacher(id: string) {
  return useMutation({
    mutationFn: async () => {
      await api.post(TEACHER_CLAIM_URL(id));
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- Update Profile ---

export interface UpdateProfileInput {
  name?: string;
  fieldOfStudy?: string;
  university?: string;
  avatar?: File | string;
}

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (input.avatar instanceof File) {
        const formData = new FormData();
        Object.entries(input).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        });
        const { data } = await api.patch<UpdateProfileInput>(PROFILE_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      }
      const { data } = await api.patch<UpdateProfileInput>(PROFILE_URL, input);
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(['auth', 'me'], data);
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}