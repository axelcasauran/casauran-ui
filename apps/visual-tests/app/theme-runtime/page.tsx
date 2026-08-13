import './theme-probe.css';

export default function ThemeRuntimePage() {
  return (
    <main className="theme-matrix" data-testid="theme-matrix">
      <h1>CSS and theme runtime</h1>
      <div className="theme-matrix__grid">
        <article
          className="theme-probe theme-probe--override"
          data-density="comfortable"
          data-testid="light-comfortable"
          data-theme="light"
        >
          <h2>Light comfortable</h2>
          <p className="theme-probe__secondary">Semantic color and comfortable spacing.</p>
          <span className="theme-probe__action" data-testid="override-target">
            Consumer override
          </span>
        </article>

        <article
          className="theme-probe"
          data-density="compact"
          data-testid="dark-compact"
          data-theme="dark"
        >
          <h2>Dark compact</h2>
          <p className="theme-probe__secondary">Nested theme and compact density.</p>
          <span className="theme-probe__status">Success status</span>
        </article>

        <article
          className="theme-probe"
          data-density="comfortable"
          data-testid="rtl-probe"
          data-theme="light"
          dir="rtl"
        >
          <h2>RTL logical spacing</h2>
          <div className="theme-probe__logical" data-testid="logical-marker" />
        </article>

        <article
          className="theme-probe"
          data-density="comfortable"
          data-testid="motion-probe"
          data-theme="light"
        >
          <h2>Adaptive media</h2>
          <span className="theme-probe__action" data-testid="motion-target">
            Motion target
          </span>
        </article>
      </div>

      <aside
        className="theme-probe"
        data-density="compact"
        data-testid="portal-scope"
        data-theme="dark"
      >
        Detached portal scope copies theme and density attributes.
      </aside>
    </main>
  );
}
