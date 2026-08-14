import { docsIndex } from '../../lib/content';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(docsIndex, {
    headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=3600' },
  });
}
