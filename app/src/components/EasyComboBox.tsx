import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface EasyComboBoxProps {
  items: { value: string; label: string, description?: string }[];
  emptyText: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}

function EasyComboBox({ items, emptyText, value, onValueChange, placeholder }: EasyComboBoxProps) {
  
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between font-normal px-3 py-2 hover:bg-background grid grid-cols-[1fr,auto] gap-2"
          >
            <span className='min-w-0 truncate text-left'>
              {value
                ? items.find((i) => i.value === value)?.label
                : placeholder
              }
            </span>
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
                  <Tooltip key={i.value}>
                    <TooltipTrigger className='block text-left w-full'>
                      <CommandItem
                        value={i.value}
                        onSelect={(currentValue) => {
                          onValueChange(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'size-4 mr-2',
                            value === i.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span>{i.label}</span>  
                      </CommandItem>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className='max-w-[280px]'>
                      <p className='text-muted-foreground'>{i.description}</p>
                    </TooltipContent> 
                  </Tooltip>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

export default EasyComboBox;
