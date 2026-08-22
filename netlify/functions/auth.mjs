/**
 * Decap CMS OAuth — step 1 of 2.
 *
 * GitHub requires a server-side secret to issue a token, so the browser cannot
 * do this alone. Decap opens this endpoint in a popup; we hand the visitor to
 * GitHub's authorization screen. GitHub does the actual authentication — this
 * function never sees a password, and only accounts with push access to the
 * repository can produce a usable token.
 */

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize'

export default async (request) => {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return new Response('GITHUB_CLIENT_ID is not set on this site.', { status: 500 })
  }

  const url = new URL(request.url)
  const state = crypto.randomUUID()

  const authorize = new URL(GITHUB_AUTHORIZE)
  authorize.searchParams.set('client_id', clientId)
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`)
  authorize.searchParams.set('scope', url.searchParams.get('scope') || 'repo,user')
  authorize.searchParams.set('state', state)

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // Guards the callback against cross-site request forgery.
      'Set-Cookie': `decap_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=600`,
      'Cache-Control': 'no-store'
    }
  })
}
