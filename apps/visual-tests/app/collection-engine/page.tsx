import {
  applySelectionIntent,
  createCollectionSnapshot,
  createSelectionState,
  findTypeaheadMatch,
  getVisibleKeys,
  moveActiveKey,
} from '@casauran-internal/collections';

const items = [
  { key: 'projects', textValue: 'Projects' },
  { key: 'alpha', parentKey: 'projects', textValue: 'Alpha' },
  { key: 'unavailable', parentKey: 'projects', disabled: true, textValue: 'Unavailable' },
  { key: 'beta', parentKey: 'projects', textValue: 'Beta' },
  { key: 'team', parentKey: 'beta', textValue: 'Team' },
] as const;

export default function CollectionEnginePage() {
  const collection = createCollectionSnapshot(items);
  const visibleKeys = getVisibleKeys(collection, ['projects', 'beta']);
  const activeKey = moveActiveKey(collection, 'alpha', 'next');
  const selection = applySelectionIntent(
    collection,
    createSelectionState(collection, ['alpha'], 'alpha'),
    'team',
    { mode: 'multiple', intent: 'range' },
  );
  const typeaheadMatch = findTypeaheadMatch(collection, 't', 'beta');

  return (
    <main>
      <h1>Collection engine</h1>
      <p data-testid="collection-server-probe">Rendered by a Server Component route.</p>
      <dl>
        <dt>Active key</dt>
        <dd data-testid="active-key">{activeKey}</dd>
        <dt>Selected keys</dt>
        <dd data-testid="selected-keys">{selection.selectedKeys.join(',')}</dd>
        <dt>Typeahead match</dt>
        <dd data-testid="typeahead-match">{typeaheadMatch}</dd>
      </dl>
      <ol aria-label="Visible collection keys">
        {visibleKeys.map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ol>
    </main>
  );
}
