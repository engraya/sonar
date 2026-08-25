import type { ReactNode } from "react";
import { clsx } from "clsx";

export interface PanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A titled surface for grouping a chart or table on a dashboard. */
export function Panel({ title, subtitle, actions, className, children }: PanelProps) {
  return (
    <section className={clsx("sonar-panel", className)}>
      {title || actions ? (
        <header className="sonar-panel__head">
          <div>
            {title ? <h2 className="sonar-panel__title">{title}</h2> : null}
            {subtitle ? <p className="sonar-panel__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
