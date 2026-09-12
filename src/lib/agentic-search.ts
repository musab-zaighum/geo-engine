import * as cheerio from 'cheerio';

export interface DiscoveredSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface DiscoveryResponse {
  isDirectUrl: boolean;
  targetUrl: string;
  query: string;
  discoveredTitle?: string;
  snippet?: string;
  searchResults: DiscoveredSearchResult[];
}

export function isUrlCandidate(str: string): boolean {
  const trimmed = str.trim().toLowerCase();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
  if (
    (trimmed.includes('.com') ||
      trimmed.includes('.org') ||
      trimmed.includes('.net') ||
      trimmed.includes('.io') ||
      trimmed.includes('.au') ||
      trimmed.includes('.uk') ||
      trimmed.includes('.ca') ||
      trimmed.includes('.clinic') ||
      trimmed.includes('.health') ||
      trimmed.includes('.med')) &&
    !trimmed.includes(' ')
  ) {
    return true;
  }
  return false;
}

export function normalizeUrl(rawUrl: string): string {
  let urlStr = rawUrl.trim();
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = 'https://' + urlStr;
  }
  return urlStr;
}

export async function discoverClinicUrl(queryOrUrl: string): Promise<DiscoveryResponse> {
  const trimmed = queryOrUrl.trim();

  if (isUrlCandidate(trimmed)) {
    const targetUrl = normalizeUrl(trimmed);
    return {
      isDirectUrl: true,
      targetUrl,
      query: trimmed,
      searchResults: [
        {
          title: 'Direct URL Input',
          url: targetUrl,
          snippet: 'Direct target domain provided by user.',
        },
      ],
    };
  }

  // Perform agentic web search discovery via DuckDuckGo HTML metasearch
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(
      trimmed + ' official website medical clinic'
    )}`;

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CiteMedSearch/1.0',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const results: DiscoveredSearchResult[] = [];

      $('.result').each((_, element) => {
        const titleEl = $(element).find('.result__title a');
        const snippetEl = $(element).find('.result__snippet');
        const href = titleEl.attr('href');
        const title = titleEl.text().trim();
        const snippet = snippetEl.text().trim();

        if (href && title) {
          let actualUrl = href;
          if (href.includes('uddg=')) {
            try {
              const urlParams = new URLSearchParams(href.split('?')[1]);
              const rawUddg = urlParams.get('uddg');
              if (rawUddg) actualUrl = decodeURIComponent(rawUddg);
            } catch {
              // ignore url parsing error
            }
          }
          if (
            actualUrl.startsWith('http') &&
            !actualUrl.includes('duckduckgo.com') &&
            !actualUrl.includes('wikipedia.org') &&
            !actualUrl.includes('facebook.com') &&
            !actualUrl.includes('linkedin.com')
          ) {
            results.push({
              title,
              url: actualUrl,
              snippet,
            });
          }
        }
      });

      if (results.length > 0) {
        const topResult = results[0];
        return {
          isDirectUrl: false,
          targetUrl: topResult.url,
          query: trimmed,
          discoveredTitle: topResult.title,
          snippet: topResult.snippet,
          searchResults: results.slice(0, 5),
        };
      }
    }
  } catch (err) {
    console.warn('DuckDuckGo search discovery fallback:', err);
  }

  // Fallback target URL if web search yields no clean organic result
  const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  return {
    isDirectUrl: false,
    targetUrl: fallbackUrl,
    query: trimmed,
    discoveredTitle: `${trimmed} (Search Result)`,
    snippet: 'Automatic search discovery query executed.',
    searchResults: [
      {
        title: trimmed,
        url: fallbackUrl,
        snippet: 'Search discovery generated for business query.',
      },
    ],
  };
}
