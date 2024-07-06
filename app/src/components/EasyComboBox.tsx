import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface EasyComboBoxProps {
  items: { value: string; label: string }[];
  emptyText: string;
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
}

function EasyComboBox({ items, emptyText, value, onValueChange, placeholder }: EasyComboBoxProps) {
  
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between font-normal px-3 py-2 hover:bg-background"
        >
          {value
            ? items.find((i) => i.value === value)?.label
            : placeholder}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((i) => (
                <CommandItem
                  key={i.value}
                  value={i.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'h-4 w-4 mr-2',
                      value === i.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {i.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default EasyComboBox;