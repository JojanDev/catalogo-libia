import type { ReactNode } from "react";
import { CartIcon } from "../cart/CartIcon.tsx";
import { CartDrawer } from "../cart/CartDrawer.tsx";

interface MainLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function MainLayout({ children, showNav = true }: MainLayoutProps) {
  return (
    <div className="bg-canvas text-text-primary antialiased min-h-screen font-body">
      {showNav && (
        <nav className="bg-card-bg border-b border-border-soft sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between h-16">
            <a
              href="#/"
              className="text-lg font-semibold tracking-[0.25em] text-text-primary uppercase font-heading"
            >
              Libia
            </a>
            <div className="flex items-center gap-6">
              <ul className="flex gap-8 text-xs font-medium text-text-muted uppercase tracking-wider font-body">
                <li>
                  <a href="#/" className="hover:text-warm-accent transition-colors">
                    Catálogo
                  </a>
                </li>
              </ul>
              <CartIcon />
            </div>
          </div>
        </nav>
      )}
      {children}
      <CartDrawer />
    </div>
  );
}
