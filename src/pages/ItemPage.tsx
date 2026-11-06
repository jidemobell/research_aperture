import { Link, useParams } from 'react-router-dom';
import { itemsBySlug } from '../content';
import { Layout } from '../components/Layout';
import { Markdown } from '../components/Markdown';
import { StatusBadge } from '../components/StatusBadge';

export function ItemPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? itemsBySlug[slug] : undefined;

  if (!item) {
    return (
      <Layout>
        <p className="text-slate-400">That note does not exist.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← All research
        </Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/" className="text-sm text-slate-500 hover:text-accent transition-colors">
        ← All research
      </Link>

      <header className="mt-6 mb-8">
        <StatusBadge tone={item.tone} status={item.status} />
        <h1 className="mt-3 text-2xl font-semibold text-slate-100 tracking-tight">
          {item.title}
        </h1>
        <p className="mt-3 text-slate-400 leading-relaxed">{item.problem}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-1 rounded-full border border-ink-800 bg-ink-800/40 text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {item.link && (
          <a
            href={item.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            {item.link.label} ↗
          </a>
        )}
        {!item.link && item.unavailable && (
          <p className="mt-4 text-xs text-slate-500">{item.unavailable}</p>
        )}
      </header>

      <div className="space-y-14">
        {item.docs.map((doc, index) => (
          <section key={`${item.slug}-${index}`}>
            {item.docs.length > 1 && (
              <div className="text-[11px] uppercase tracking-wider text-slate-600 mb-4">
                {doc.title}
              </div>
            )}
            <Markdown>{doc.body}</Markdown>
          </section>
        ))}
      </div>
    </Layout>
  );
}
