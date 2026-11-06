import { items } from '../content';
import { Layout } from '../components/Layout';
import { ItemCard } from '../components/ItemCard';

export function IndexPage() {
  return (
    <Layout>
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
          Research &amp; Explorations
        </h1>
        <p className="mt-3 text-slate-400 leading-relaxed">
          Two things I have been working through on my own time — a specification for a
          study about exposure bias, and a generative-music prototype. They sit at
          different stages, and the status line on each says which.
        </p>

        <div className="mt-6 rounded-lg border border-ink-800 bg-ink-900 p-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
            How to read the status
          </div>
          <ul className="space-y-1.5 text-sm text-slate-400">
            <li>
              <span className="text-sky-300">Research</span> — a specified experiment.
              The method is fixed; the results do not exist yet.
            </li>
            <li>
              <span className="text-emerald-300">Prototype</span> — it runs. It is not
              benchmarked and no quality claim is being made.
            </li>
          </ul>
        </div>
      </header>

      <section className="space-y-6">
        {items.map((item) => (
          <ItemCard key={item.slug} item={item} />
        ))}
      </section>
    </Layout>
  );
}
