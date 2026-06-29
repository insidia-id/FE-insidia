import type { SelectOption } from '../types/common.types';

export function toSelectOptions<TItem>(items: TItem[] | undefined, mapper: (item: TItem) => SelectOption): SelectOption[] {
  return (items ?? []).map(mapper);
}
