import type { ItemTone } from '../types';

export const toneLabel: Record<ItemTone, string> = {
  exploration: 'Exploration',
  research: 'Research',
  prototype: 'Prototype',
};

export const toneBadge: Record<ItemTone, string> = {
  exploration: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  research: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  prototype: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
};

export function StatusBadge({
  tone,
  status,
}: {
  tone: ItemTone;
  status: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded border ${toneBadge[tone]}`}
      >
        {toneLabel[tone]}
      </span>
      <span className="text-xs text-slate-400">{status}</span>
    </div>
  );
}
