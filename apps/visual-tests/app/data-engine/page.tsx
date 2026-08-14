import { processData, type DataGroup } from '@casauran-internal/data';

interface ServerRow {
  readonly id: number;
  readonly region: string;
  readonly score: number;
  readonly active: boolean;
}

const rows: readonly ServerRow[] = [
  { id: 1, region: 'APAC', score: 90, active: true },
  { id: 2, region: 'EMEA', score: 70, active: true },
  { id: 3, region: 'APAC', score: 80, active: true },
  { id: 4, region: 'AMER', score: 60, active: false },
  { id: 5, region: 'EMEA', score: 95, active: true },
  { id: 6, region: 'APAC', score: 75, active: true },
];

export default function DataEnginePage() {
  const state = {
    filter: { field: 'active', operator: 'eq', value: true },
    sort: [{ field: 'score', direction: 'desc' }],
    group: [{ field: 'region', aggregates: [{ field: 'score', aggregate: 'sum' }] }],
    aggregates: [{ field: 'score', aggregate: 'sum' }],
    page: { skip: 1, take: 3 },
  } as const;
  const result = processData(rows, state);
  const groups = result.data as readonly DataGroup<ServerRow>[];
  const projection = groups.map((group) => ({
    region: group.value,
    ids: (group.items as readonly ServerRow[]).map((row) => row.id),
    sum: group.aggregates[0]?.value,
  }));

  return (
    <main>
      <h1>Data engine</h1>
      <section aria-label="Data engine server result">
        <p data-testid="data-server-probe">server-safe package import from SSR.</p>
        <p data-testid="data-total">{result.total}</p>
        <p data-testid="data-sum">{String(result.aggregateResults[0]?.value)}</p>
        <pre data-testid="data-projection">{JSON.stringify(projection)}</pre>
        <pre data-testid="data-state">{JSON.stringify(state)}</pre>
      </section>
    </main>
  );
}
