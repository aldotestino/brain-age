import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip';
import { TooltipContentProps } from '@radix-ui/react-tooltip';

function WithTooltip({ tooltip, children, ...tooltipContentProps }: {tooltip: string, children: React.ReactNode} & TooltipContentProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent {...tooltipContentProps}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default WithTooltip;