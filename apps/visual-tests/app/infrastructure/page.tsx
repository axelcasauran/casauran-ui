import { ClientProbe } from './client-probe';

export default function InfrastructurePage() {
  return (
    <main>
      <h1>Build and test infrastructure</h1>
      <p data-testid="server-probe">Rendered by the production Next.js host.</p>
      <ClientProbe />
    </main>
  );
}
