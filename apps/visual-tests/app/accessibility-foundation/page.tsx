import { AccessibilityClientProbe } from './client-probe';
import './accessibility-probe.css';

export default function AccessibilityFoundationPage() {
  return (
    <main className="accessibility-probe">
      <h1>Accessibility foundation</h1>
      <p data-testid="accessibility-server-probe">
        Server-rendered semantic and keyboard foundation probe.
      </p>
      <AccessibilityClientProbe />
    </main>
  );
}
