import type { Source } from '../../api';

interface SourceCardProps {
  source: Source;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  // Determine color based on index
  const hoverColors = ['hover:bg-tertiary-orange', 'hover:bg-tertiary-teal', 'hover:bg-secondary-container'];
  const textColors = ['group-hover:text-primary', 'group-hover:text-on-tertiary', 'group-hover:text-primary'];
  const bgHoverClass = hoverColors[index % hoverColors.length];
  const textHoverClass = textColors[index % textColors.length];

  return (
    <div className={`border-hard p-4 bg-surface ${bgHoverClass} transition-all cursor-pointer group relative shadow-hard active-press`}>
      <div className="absolute -left-[12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-tertiary-violet border-hard shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full flex items-center justify-center text-on-tertiary z-10 text-[10px] font-bold">
        {index + 1}
      </div>
      <div className="flex items-center gap-4 pl-4">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>description</span>
        <div className="flex-1">
          <h4 className={`font-label-bold text-label-bold uppercase leading-tight ${textHoverClass}`}>
            {source.metadata?.source || `Source Document ${index + 1}`}
          </h4>
          <p className={`text-[12px] text-on-surface-variant line-clamp-1 ${textHoverClass}`}>
            "{source.text}"
          </p>
        </div>
      </div>
    </div>
  );
}
