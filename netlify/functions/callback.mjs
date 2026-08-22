/**
 * Decap CMS OAuth — step 2 of 2.
 *
 * GitHub redirects here with a short-lived code. We exchange it for an access
 * token using the client secret (server side only), then hand the token to the
 * CMS window using the postMessage handshake Decap expects.
 */

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

const readCookie = (header, name) =>
  (header ?? '')
    .split(';')
    .map((part) => part.trim().split('='))
    .find(([key]) => key === name)?.[1]

const page = (status, payload) => `<!doctype html>
<html><head><meta charset="utf-8"><title>Signing in…</title></head>
<body style="font:14px system-ui;padding:2rem;background:#060d17;color:#e8eef6">
<p>${status === 'success' ? 'Signed in. You can close this window.' : 'Sign-in failed.'}</p>
<script>
  (function () {
    var message = 'authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))};
    function receive(e) {
      if (!e.origin) return;
      window.opener.postMessage(message, e.origin);
      window.removeEventListener('message', receive, false);
    }
    window.addEventListener('message', receive, false);
    window.opener && window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`

const html = (body, status = 200) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  })

export default async (request) => {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return html(page('error', { message: 'GitHub OAuth environment variables are not set.' }), 500)
  }

  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const expectedState = readCookie(request.headers.get('cookie'), 'decap_oauth_state')

  if (!code) return html(page('error', { message: 'No authorization code returned by GitHub.' }), 400)
  if (!state || !expectedState || state !== expectedState) {
    return html(page('error', { message: 'Invalid OAuth state. Please try signing in again.' }), 400)
  }

  try {
    const response = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${url.origin}/api/callback`
      })
    })
    const data = await response.json()

    if (data.error || !data.access_token) {
      return html(page('error', { message: data.error_description ?? 'Token exchange failed.' }), 401)
    }

    return html(page('success', { token: data.access_token, provider: 'github' }))
  } catch (error) {
    return html(page('error', { message: error.message }), 500)
  }
}
