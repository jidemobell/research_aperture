import { Link } from 'react-router-dom';
import type { ResearchItem } from '../types';
import { StatusBadge } from './StatusBadge';

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <p className="text-sm text-slate-300 leading-relaxed">{children}</p>
    </div>
  );
}

export function ItemCard({ item }: { item: ResearchItem }) {
  return (
    <article className="rounded-xl border border-ink-800 bg-ink-900 p-6 hover:border-accent/40 transition-colors">
      <StatusBadge tone={item.tone} status={item.status} />

      <h2 className="mt-3 text-lg font-semibold text-slate-100">
        <Link to={`/${item.slug}`} className="hover:text-accent transition-colors">
          {item.title}
        </Link>
      </h2>

      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.problem}</p>

      <div className="mt-5 space-y-4">
        <Field label="The shape">{item.shape}</Field>
        <Field label="Why it is interesting">{item.why}</Field>
        <Field label="What is unresolved">{item.open}</Field>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-1 rounded-full border border-ink-800 bg-ink-800/40 text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <Link to={`/${item.slug}`} className="text-sm text-accent hover:underline">
          Read the notes →
        </Link>
      </div>
    </article>
  );
}
