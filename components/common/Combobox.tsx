'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useDebounce } from '@/lib/hooks/use-debounce';

interface ComboboxItem {
  label: string;
  value: string;
  meta?: any;
}

interface ComboboxProps {
  data: ComboboxItem[];
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onSearch?: (search: string) => void;
}

export function Combobox({ data, value, onChange, placeholder, disabled, onSearch }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const debouncedSearch = useDebounce(search, 400);

  React.useEffect(() => {
    if (!open) return;
    if (!debouncedSearch || debouncedSearch.length < 3) return;

    onSearch?.(debouncedSearch);
  }, [debouncedSearch, open]);
  const selected = data.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className="w-full justify-between">
          {selected ? selected.label : placeholder || 'Pilih...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] max-h-80 z-50">
        <Command className="w-full">
          <CommandInput placeholder="Cari..." value={search} onValueChange={setSearch} />

          <CommandEmpty>Tidak ditemukan</CommandEmpty>

          <CommandList className="h-50 overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === item.value ? 'opacity-100' : 'opacity-0'}`} />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
