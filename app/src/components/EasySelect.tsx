'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function EasySelect({ items, placeholder, ...props }: React.ComponentProps<typeof Select> & {
  items: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default EasySelect;

