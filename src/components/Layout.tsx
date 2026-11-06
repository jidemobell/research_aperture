import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <Link to="/" className="text-slate-200 font-semibold tracking-tight">
            Research &amp; Explorations
          </Link>
          <a
            href="https://www.jidemobell.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-accent transition-colors"
          >
            jidemobell.com
          </a>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">{children}</main>

      <footer className="border-t border-ink-800">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-slate-500 leading-relaxed">
          Research notes are working documents. Every status line describes what exists
          today, not what is planned.
        </div>
      </footer>
    </div>
  );
}
