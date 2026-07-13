import { z } from 'zod';
import { LessonType } from '../types/lessons.types';
import { learningItemsSchema } from '../../learning-items/schema/learning-items.schema';

export const lessonsSchema = learningItemsSchema.extend({
  typeLesson: z.enum(Object.values(LessonType)),
  contentJson: z.string().optional(),
  contentHtml: z.string().optional(),
});

export type LessonsSchema = z.infer<typeof lessonsSchema>;
export const updatableLessonsSchema = lessonsSchema.partial();
export type UpdatableLessonValues = z.infer<typeof updatableLessonsSchema>;
