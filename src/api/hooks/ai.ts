import { useMutation } from '@tanstack/react-query';
import { api } from '../client';
import { getApiErrorMessage } from '../client';

const SUMMARY_URL = (materialId: string) => `/materials/${materialId}/summary/`;
const QUIZ_URL = (materialId: string) => `/materials/${materialId}/quiz/`;

// --- AI Summary ---

export function useMaterialSummary(materialId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ summary: string }>(SUMMARY_URL(materialId));
      return data.summary;
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

// --- AI Quiz ---

export function useMaterialQuiz(materialId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ questions: string[] }>(QUIZ_URL(materialId));
      return data.questions;
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}