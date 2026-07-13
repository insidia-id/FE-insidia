import { useGetCourseModuleById } from './courses-module.query';

export function useCourseModuleDetail(moduleId: string | undefined | null) {
  const { data: module, isLoading, isError, error } = useGetCourseModuleById(moduleId);

  return {
    module,
    isLoading,
    isError,
    error,
  };
}
