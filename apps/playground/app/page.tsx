import { ButtonDemo } from './button-demo';
import { IconDemo } from './icon-demo';
import { SVGIconDemo } from './svg-icon-demo';

export default function Page() {
  return (
    <main>
      <h1>Casauran UI — playground</h1>
      <p>Interactive examples use supported public APIs.</p>
      <ButtonDemo />
      <IconDemo />
      <SVGIconDemo />
    </main>
  );
}
