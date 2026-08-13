import { ReactStateClientProbe } from './client-probe';

export default function ReactStateFoundationPage() {
  return (
    <main>
      <h1>React state foundation</h1>
      <p data-testid="react-state-server-probe">Rendered by the Server Component route.</p>
      <ReactStateClientProbe />
    </main>
  );
}
