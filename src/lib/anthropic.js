const PROXY_BASE = '/api/anthropic';

/**
 * Send a message to the Anthropic Messages API via the local Vite proxy.
 * The proxy injects the API key server-side — no secrets in the browser.
 *
 * @param {Object} options
 * @param {string}  options.model        - e.g. "claude-sonnet-4-20250514"
 * @param {number}  [options.maxTokens]  - max tokens to generate (default 1024)
 * @param {string}  [options.system]     - optional system prompt
 * @param {Array}   options.messages     - array of {role, content} objects
 * @returns {Promise<Object>} the full API response body
 */
export async function createMessage({
  model = 'claude-sonnet-4-20250514',
  maxTokens = 1024,
  system,
  messages,
}) {
  const body = {
    model,
    max_tokens: maxTokens,
    messages,
  };

  if (system) {
    body.system = system;
  }

  const res = await fetch(`${PROXY_BASE}/v1/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      `Anthropic API error ${res.status}: ${JSON.stringify(err)}`
    );
  }

  return res.json();
}
