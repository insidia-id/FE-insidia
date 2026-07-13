import { LessonsSchema } from '../schema/lessons.schema';
import { Lesson } from '../types/lessons.types';
export const defaultLessonValues = (): LessonsSchema => {
  return {
    title: '',
    slug: '',
    description: '',
    order: 1,
    isPreview: false,
    published: false,
    availableFrom: null,
    availableUntil: null,
    type: 'LESSON',
    typeLesson: 'ARTICLE',
    contentJson: '',
    contentHtml: '',
  };
};

export const toformLessonValues = (lesson: Lesson): LessonsSchema => {
  return {
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description ?? '',
    order: lesson.order,
    isPreview: lesson.locked ?? false,
    published: lesson.published,
    availableFrom: lesson.availableFrom ?? null,
    availableUntil: lesson.availableUntil ?? null,
    type: lesson.type,
    typeLesson: lesson.typeLesson,
    contentJson: lesson.contentJson ?? '',
    contentHtml: lesson.contentHtml ?? '',
  };
};
