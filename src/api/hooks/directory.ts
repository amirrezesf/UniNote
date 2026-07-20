import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { qk } from '../keys';
import type { University, Field, Teacher, Course, Material, MaterialType, Paginated } from '../../../types';

// --- Universities ---

export function useUniversities() {
  return useQuery({
    queryKey: qk.universities(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<University>>('/universities/');
      return data.results;
    },
  });
}

export function useUniversity(id: string) {
  return useQuery({
    queryKey: qk.university(id),
    queryFn: async () => {
      const { data } = await api.get<University>(`/universities/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUniversityFields(id: string) {
  return useQuery({
    queryKey: qk.universityFields(id),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Field>>(`/universities/${id}/fields/`);
      return data.results;
    },
    enabled: !!id,
  });
}

export function useUniversityTeachers(id: string) {
  return useQuery({
    queryKey: qk.universityTeachers(id),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Teacher>>(`/universities/${id}/teachers/`);
      return data.results;
    },
    enabled: !!id,
  });
}

export function useUniversityCourses(id: string) {
  return useQuery({
    queryKey: qk.universityCourses(id),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Course>>(`/universities/${id}/courses/`);
      return data.results;
    },
    enabled: !!id,
  });
}

// --- Fields ---

export function useFields() {
  return useQuery({
    queryKey: qk.fields(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Field>>('/fields/');
      return data.results;
    },
  });
}

export function useField(id: string) {
  return useQuery({
    queryKey: qk.field(id),
    queryFn: async () => {
      const { data } = await api.get<Field>(`/fields/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useFieldTeachers(id: string) {
  return useQuery({
    queryKey: qk.fieldTeachers(id),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Teacher>>(`/fields/${id}/teachers/`);
      return data.results;
    },
    enabled: !!id,
  });
}

export function useFieldCourses(id: string) {
  return useQuery({
    queryKey: qk.fieldCourses(id),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Course>>(`/fields/${id}/courses/`);
      return data.results;
    },
    enabled: !!id,
  });
}

// --- Teachers ---

export interface TeacherQueryParams {
  university?: string;
  field?: string;
  q?: string;
}

export function useTeachers(params?: TeacherQueryParams) {
  return useQuery({
    queryKey: qk.teachers(params),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Teacher>>('/teachers/', { params });
      return data.results;
    },
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: qk.teacher(id),
    queryFn: async () => {
      const { data } = await api.get<Teacher>(`/teachers/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useTeacherCourses(id: string) {
  return useQuery({
    queryKey: qk.teacherCourses(id),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Course>>(`/teachers/${id}/courses/`);
      return data.results;
    },
    enabled: !!id,
  });
}

export function useTeacherMaterials(id: string, type?: MaterialType) {
  return useQuery({
    queryKey: qk.teacherMaterials(id, type),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Material>>(`/teachers/${id}/materials/`, { params: { type } });
      return data.results;
    },
    enabled: !!id,
  });
}

// --- Courses ---

export interface CourseQueryParams {
  field?: string;
  university?: string;
  teacher?: string;
  q?: string;
}

export function useCourses(params?: CourseQueryParams) {
  return useQuery({
    queryKey: qk.courses(params),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Course>>('/courses/', { params });
      return data.results;
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: qk.course(id),
    queryFn: async () => {
      const { data } = await api.get<Course>(`/courses/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCourseMaterials(id: string, type?: MaterialType) {
  return useQuery({
    queryKey: qk.courseMaterials(id, type),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Material>>(`/courses/${id}/materials/`, { params: { type } });
      return data.results;
    },
    enabled: !!id,
  });
}