TITLE: Adding .env to .gitignore for Security
DESCRIPTION: This snippet demonstrates adding the .env file to your .gitignore to prevent it from being committed to your version control system. This is a fundamental security practice to ensure API keys and other sensitive configurations are not publicly exposed.
SOURCE: https://resend.com/docs/knowledge-base/how-to-handle-api-keys

LANGUAGE: gitignore
CODE:

```
.env
```

---

TITLE: Converting React Email Template to Plain Text
DESCRIPTION: This snippet shows how to convert a React email component into a plain text version using the `render` function with the `plainText: true` option. This is crucial for ensuring email readability across all clients, especially those that cannot display HTML.
SOURCE: https://react.email/docs/utilities/render

LANGUAGE: JavaScript
CODE:

```
import { MyTemplate } from './email';
import { render } from '@react-email/render';

const text = await render(<MyTemplate />, {
  plainText: true,
});

console.log(text);
```

---

TITLE: Excluding Environment Variables in .gitignore - Text
DESCRIPTION: This snippet shows how to add '.env' to your .gitignore file. This is a crucial step to prevent sensitive environment variables, such as API keys, from being committed to version control, ensuring security and best practices.
SOURCE: https://resend.com/docs/knowledge-base/how-to-handle-api-keys

LANGUAGE: Text
CODE:

```
.env\n
```

---

TITLE: Implementing One-Click Unsubscribe Email Headers
DESCRIPTION: These email headers are crucial for implementing one-click unsubscribe functionality, as mandated by Google and Yahoo. The `List-Unsubscribe` header provides a URL for direct unsubscribe, while `List-Unsubscribe-Post` indicates support for a one-click POST request, allowing immediate unsubscription without visiting a page.
SOURCE: https://resend.com/blog/gmail-and-yahoo-bulk-sending-requirements-for-2024

LANGUAGE: Email Header
CODE:

```
List-Unsubscribe: <https://example.com/unsubscribe>
```

LANGUAGE: Email Header
CODE:

```
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

---

TITLE: Sending Email with List-Unsubscribe Header (JavaScript)
DESCRIPTION: This JavaScript code snippet illustrates how to send an email using the Resend SDK. It configures the sender, recipients, subject, and HTML content. Crucially, it includes a 'List-Unsubscribe' header, which is a standard practice for transactional emails to allow recipients to easily unsubscribe, improving email deliverability and user experience. The header value is a string containing the unsubscribe URL, enclosed in single quotes as per RFC 2369.
SOURCE: https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails

LANGUAGE: JavaScript
CODE:

```
resend.emails.send({
  from: 'Acme <no-reply@resend.dev>',
  to: ['user@gmail.com'],
  subject: 'Hello World',
  html: '<p>Hello from Resend!</p>',
  headers: {
    'List-Unsubscribe': "'<https://example.com/unsubscribe>'"
  }
});
```

---

TITLE: Resend API Authentication Header - Plaintext
DESCRIPTION: This snippet demonstrates the required Authorization header format for authenticating requests to the Resend API. Users must replace 're_xxxxxxxxx' with their actual API Key obtained from the Resend dashboard.
SOURCE: https://resend.com/docs/api-reference/introduction

LANGUAGE: plaintext
CODE:

```
Authorization: Bearer re_xxxxxxxxx
```

---

TITLE: Protecting Next.js API Routes with NextAuth.js getServerSession
DESCRIPTION: This snippet demonstrates how to secure a Next.js API route using `getServerSession` from `next-auth/next`. It checks for an active session and sends protected content if the user is signed in, otherwise, it returns an error, ensuring only authenticated users can access the route.
SOURCE: https://next-auth.js.org/getting-started/example

LANGUAGE: JavaScript
CODE:

```
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}
```

---

TITLE: Storing Resend API Key in .env (TypeScript)
DESCRIPTION: This snippet illustrates how to securely store a Resend API key within a '.env' file, which is a common practice for managing environment variables in Node.js and TypeScript applications. Storing keys this way prevents them from being hard-coded or committed to version control, enhancing security. The example shows the variable assignment syntax.
SOURCE: https://resend.com/docs/knowledge-base/how-to-handle-api-keys

LANGUAGE: TypeScript
CODE:

```
RESEND_API_KEY = 're_xxxxxxxxx';\n
```

---

TITLE: Sending Email with List-Unsubscribe Header (Node.js)
DESCRIPTION: This Node.js code snippet demonstrates how to send an email using the Resend SDK, incorporating the `List-Unsubscribe` header. This header enables email clients to offer a direct unsubscribe option in their UI, improving user experience and compliance. It requires the `resend` package and a valid API key for authentication.
SOURCE: https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails

LANGUAGE: Node.js
CODE:

```
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'hello world',
  text: 'it works!',
  headers: {
    'List-Unsubscribe': '<https://example.com/unsubscribe>',
  }
});
```

---

TITLE: Example DMARC TXT Record
DESCRIPTION: This snippet provides a complete example of a DMARC TXT record. It includes the DMARC version (`v=DMARC1`), a quarantine policy (`p=quarantine;`) applied to all emails (`pct=100;`), and an email address for receiving aggregate DMARC reports (`rua=mailto:dmarcreports@example.com`). This record is crucial for email authentication and brand protection.
SOURCE: https://resend.com/docs/knowledge-base/how-do-i-set-set-up-apple-branded-mail

LANGUAGE: plaintext
CODE:

```
"v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarcreports@example.com"
```

---

TITLE: Storing Resend API Key in .env (Shell)
DESCRIPTION: Demonstrates how to store a Resend API key in a `.env` file. This file should contain sensitive information like API keys and must be excluded from version control to prevent exposure.
SOURCE: https://resend.com/docs/knowledge-base/how-to-handle-api-keys

LANGUAGE: Shell
CODE:

```
RESEND_API_KEY = 're_xxxxxxxxx';\n
```

---

TITLE: Storing Resend API Key in .env File
DESCRIPTION: This snippet illustrates how to store your Resend API key as an environment variable within a .env file. This method is crucial for keeping sensitive credentials out of your source code and preventing accidental exposure in version control.
SOURCE: https://resend.com/docs/knowledge-base/how-to-handle-api-keys

LANGUAGE: dotenv
CODE:

```
RESEND_API_KEY = 're_xxxxxxxxx';
```

---

TITLE: Verifying Svix Webhooks in Netlify Functions
DESCRIPTION: This code demonstrates how to verify Svix webhooks within a Netlify Function. It expects the raw request body and headers as input to the `handler` function, then uses `svix.Webhook` to perform the signature verification, returning a 400 status on failure.
SOURCE: https://docs.svix.com/receiving/verifying-payloads/how

LANGUAGE: Node.js
CODE:

```
import { Webhook } from "svix";
const secret = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";
export const handler = async ({body, headers}) => {
    const payload = body;
    const wh = new Webhook(secret);
    let msg;
    try {
        msg = wh.verify(payload, headers);
    } catch (err) {
        res.status(400).json({});
    }
    // Do something with the message...
    res.json({});}
```

---

TITLE: Defining UI Color Palette Variables in CSS
DESCRIPTION: This CSS snippet establishes a base layer of custom properties for a UI color system. It defines various color scales (primary, secondary, info, success, warning, error, neutral) with 11 shades each (50-950), using Oklch color values for perceptual uniformity. These variables can be reused throughout the application's stylesheets.
SOURCE: https://nuxt.com/docs/guide/directory-structure/server

LANGUAGE: CSS
CODE:

```
@layer base { :root { --ui-color-primary-50: var(--color-green-50, oklch(98.2% 0.018 155.826)); --ui-color-primary-100: var(--color-green-100, oklch(96.2% 0.044 156.743)); --ui-color-primary-200: var(--color-green-200, oklch(92.5% 0.084 155.995)); --ui-color-primary-300: var(--color-green-300, oklch(87.1% 0.15 154.449)); --ui-color-primary-400: var(--color-green-400, oklch(79.2% 0.209 151.711)); --ui-color-primary-500: var(--color-green-500, oklch(72.3% 0.219 149.579)); --ui-color-primary-600: var(--color-green-600, oklch(62.7% 0.194 149.214)); --ui-color-primary-700: var(--color-green-700, oklch(52.7% 0.154 150.069)); --ui-color-primary-800: var(--color-green-800, oklch(44.8% 0.119 151.328)); --ui-color-primary-900: var(--color-green-900, oklch(39.3% 0.095 152.535)); --ui-color-primary-950: var(--color-green-950, oklch(26.6% 0.065 152.934)); --ui-color-secondary-50: var(--color-blue-50, oklch(97% 0.014 254.604)); --ui-color-secondary-100: var(--color-blue-100, oklch(93.2% 0.032 255.585)); --ui-color-secondary-200: var(--color-blue-200, oklch(88.2% 0.059 254.128)); --ui-color-secondary-300: var(--color-blue-300, oklch(80.9% 0.105 251.813)); --ui-color-secondary-400: var(--color-blue-400, oklch(70.7% 0.165 254.624)); --ui-color-secondary-500: var(--color-blue-500, oklch(62.3% 0.214 259.815)); --ui-color-secondary-600: var(--color-blue-600, oklch(54.6% 0.245 262.881)); --ui-color-secondary-700: var(--color-blue-700, oklch(48.8% 0.243 264.376)); --ui-color-secondary-800: var(--color-blue-800, oklch(42.4% 0.199 265.638)); --ui-color-secondary-900: var(--color-blue-900, oklch(37.9% 0.146 265.522)); --ui-color-secondary-950: var(--color-blue-950, oklch(28.2% 0.091 267.935)); --ui-color-info-50: var(--color-blue-50, oklch(97% 0.014 254.604)); --ui-color-info-100: var(--color-blue-100, oklch(93.2% 0.032 255.585)); --ui-color-info-200: var(--color-blue-200, oklch(88.2% 0.059 254.128)); --ui-color-info-300: var(--color-blue-300, oklch(80.9% 0.105 251.813)); --ui-color-info-400: var(--color-blue-400, oklch(70.7% 0.165 254.624)); --ui-color-info-500: var(--color-blue-500, oklch(62.3% 0.214 259.815)); --ui-color-info-600: var(--color-blue-600, oklch(54.6% 0.245 262.881)); --ui-color-info-700: var(--color-blue-700, oklch(48.8% 0.243 264.376)); --ui-color-info-800: var(--color-blue-800, oklch(42.4% 0.199 265.638)); --ui-color-info-900: var(--color-blue-900, oklch(37.9% 0.146 265.522)); --ui-color-info-950: var(--color-blue-950, oklch(28.2% 0.091 267.935)); --ui-color-success-50: var(--color-green-50, oklch(98.2% 0.018 155.826)); --ui-color-success-100: var(--color-green-100, oklch(96.2% 0.044 156.743)); --ui-color-success-200: var(--color-green-200, oklch(92.5% 0.084 155.995)); --ui-color-success-300: var(--color-green-300, oklch(87.1% 0.15 154.449)); --ui-color-success-400: var(--color-green-400, oklch(79.2% 0.209 151.711)); --ui-color-success-500: var(--color-green-500, oklch(72.3% 0.219 149.579)); --ui-color-success-600: var(--color-green-600, oklch(62.7% 0.194 149.214)); --ui-color-success-700: var(--color-green-700, oklch(52.7% 0.154 150.069)); --ui-color-success-800: var(--color-green-800, oklch(44.8% 0.119 151.328)); --ui-color-success-900: var(--color-green-900, oklch(39.3% 0.095 152.535)); --ui-color-success-950: var(--color-green-950, oklch(26.6% 0.065 152.934)); --ui-color-warning-50: var(--color-yellow-50, oklch(98.7% 0.026 102.212)); --ui-color-warning-100: var(--color-yellow-100, oklch(97.3% 0.071 103.193)); --ui-color-warning-200: var(--color-yellow-200, oklch(94.5% 0.129 101.54)); --ui-color-warning-300: var(--color-yellow-300, oklch(90.5% 0.182 98.111)); --ui-color-warning-400: var(--color-yellow-400, oklch(85.2% 0.199 91.936)); --ui-color-warning-500: var(--color-yellow-500, oklch(79.5% 0.184 86.047)); --ui-color-warning-600: var(--color-yellow-600, oklch(68.1% 0.162 75.834)); --ui-color-warning-700: var(--color-yellow-700, oklch(55.4% 0.135 66.442)); --ui-color-warning-800: var(--color-yellow-800, oklch(47.6% 0.114 61.907)); --ui-color-warning-900: var(--color-yellow-900, oklch(42.1% 0.095 57.708)); --ui-color-warning-950: var(--color-yellow-950, oklch(28.6% 0.066 53.813)); --ui-color-error-50: var(--color-red-50, oklch(97.1% 0.013 17.38)); --ui-color-error-100: var(--color-red-100, oklch(93.6% 0.032 17.717)); --ui-color-error-200: var(--color-red-200, oklch(88.5% 0.062 18.334)); --ui-color-error-300: var(--color-red-300, oklch(80.8% 0.114 19.571)); --ui-color-error-400: var(--color-red-400, oklch(70.4% 0.191 22.216)); --ui-color-error-500: var(--color-red-500, oklch(63.7% 0.237 25.331)); --ui-color-error-600: var(--color-red-600, oklch(57.7% 0.245 27.325)); --ui-color-error-700: var(--color-red-700, oklch(50.5% 0.213 27.518)); --ui-color-error-800: var(--color-red-800, oklch(44.4% 0.177 26.899)); --ui-color-error-900: var(--color-red-900, oklch(39.6% 0.141 25.723)); --ui-color-error-950: var(--color-red-950, oklch(25.8% 0.092 26.042)); --ui-color-neutral-50: var(--color-slate-50, oklch(98.4% 0.003 247. }
```

---

TITLE: Throttled Response (429 Too Many Requests) with RateLimit and Retry-After
DESCRIPTION: This HTTP 429 Too Many Requests response indicates that the client has exhausted its quota and is being throttled. It includes a `Retry-After` header specifying when the client should retry, and a `RateLimit` header with `r=0` and `t=5`, indicating zero remaining quota and a 5-second reset. The response also provides a problem+json body for more details.
SOURCE: https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers

LANGUAGE: HTTP
CODE:

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/problem+json
Date: Mon, 05 Aug 2019 09:27:00 GMT
Retry-After: Mon, 05 Aug 2019 09:27:05 GMT
RateLimit: "default";r=0;t=5

{
"type": "https://iana.org/assignments/http-problem-types#quota-exceeded"
"title": "Too Many Requests",
"status": 429,
"policy-violations": ["default"]
}
```

---

TITLE: Defining CSS Variables for Theming and Code Highlighting
DESCRIPTION: This CSS snippet defines global custom properties (variables) for font families and a comprehensive color palette, including primary, background, and grayscale shades. It also includes rules for styling code block line highlights, dynamically adjusting background and border colors based on whether the dark mode is active or not, ensuring visual consistency for code presentation.
SOURCE: https://resend.com/docs/api-reference/introduction

LANGUAGE: CSS
CODE:

```
:root{--font-inter:'\__Inter_b13164', '\__Inter_Fallback_b13164';--font-jetbrains-mono:'\__JetBrains_Mono_ea4744', '\__JetBrains_Mono_Fallback_ea4744'}:root { --primary: 0 0 0; --primary-light: 235 236 237; --primary-dark: 10 12 16; --background-light: 255 255 255; --background-dark: 0 0 0; --gray-50: 242 242 242; --gray-100: 238 238 238; --gray-200: 222 222 222; --gray-300: 206 206 206; --gray-400: 158 158 158; --gray-500: 111 111 111; --gray-600: 79 79 79; --gray-700: 62 62 62; --gray-800: 37 37 37; --gray-900: 22 22 22; --gray-950: 10 10 10; }html:not(.dark) .codeblock-light .line-highlight:after, html:not(.dark) .codeblock-light .line-highlight { background: #00cc9937; } html:not(.dark) .codeblock-light .line-highlight:after, html:not(.dark) .codeblock-light .line-highlight:before { background: #00cc9937; } html.dark .line-highlight, html:not(.dark) .codeblock-dark .line-highlight { background: #00fff61d; } html.dark .line-highlight:after, html.dark .line-highlight:before, html:not(.dark) .codeblock-dark .line-highlight:after, html:not(.dark) .codeblock-dark .line-highlight:before { background: #00fff61d; } html.dark .line-highlight:before, html:not(.dark) .codeblock-dark .line-highlight:before { border-color: #4cd7b8; } html:not(.dark) .codeblock-light .line-highlight:before { border-color: #55d799; } #page-context-menu-button span { display: none; }
```

---

TITLE: Prettier Configuration (JavaScript)
DESCRIPTION: This JavaScript snippet exports a configuration object for Prettier, a code formatter. It specifies rules such as enabling bracket spacing, setting print width to 80 characters, using consistent quote props, single quotes, a tab width of 2, always including trailing commas, and disabling tabs.
SOURCE: https://resend.com/docs/knowledge-base/how-do-i-send-with-an-avatar

LANGUAGE: JavaScript
CODE:

```
module.exports = {\n bracketSpacing: true,\n printWidth: 80,\n quoteProps: 'consistent',\n singleQuote: true,\n tabWidth: 2,\n trailingComma: 'all',\n useTabs: false,\n};\n
```

---

TITLE: Managing Theme Selection with StarlightThemeProvider (JavaScript)
DESCRIPTION: This JavaScript snippet implements theme selection functionality, allowing users to switch between 'dark', 'light', and 'auto' themes. It uses `localStorage` to persist the user's preference and `matchMedia` to detect system theme changes when 'auto' is selected. A custom element `starlight-theme-select` is defined to encapsulate this behavior, updating the `data-theme` attribute on the `documentElement`.
SOURCE: https://docs.astro.build/en/guides/server-side-rendering/

LANGUAGE: JavaScript
CODE:

```
const r="starlight-theme",o=e=>e==="auto"||e==="dark"||e==="light"?e:"auto",c=()=>o(typeof localStorage<"u"&&localStorage.getItem(r));function n(e){typeof localStorage<"u"&&localStorage.setItem(r,e==="light"||e==="dark"?e:"")}const l=()=>matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";function t(e){StarlightThemeProvider.updatePickers(e),document.documentElement.dataset.theme=e==="auto"?l():e,n(e)}matchMedia("(prefers-color-scheme: light)").addEventListener("change",()=>{c()==="auto"&&t("auto")});class s extends HTMLElement{constructor(){super(),t(c()),this.querySelector("select")?.addEventListener("change",a=>{a.currentTarget instanceof HTMLSelectElement&&t(o(a.currentTarget.value))})}}customElements.define("starlight-theme-select",s);
```

---

TITLE: Initiating WebAuthn Verification in JavaScript
DESCRIPTION: This function initiates the WebAuthn authentication flow for account recovery. It sends a request to the backend to get a WebAuthn challenge, then uses the `webauthnAuthenticate` function to process it. Upon successful verification, it updates the UI to reflect the verified status and potentially enables the final submission button.
SOURCE: https://porkbun.com/account/domainsSpeedy

LANGUAGE: JavaScript
CODE:

```
var webAuthnInfo = null;
function bypassTwoFactorCheckWebauthn() {
    var username = jQuery.trim($('#modal_bypassTwoFactor_username').html());
    $.post("/api/user/checkBypassTwoFactor", {username:username, "test":"test"}, function(data) {
        if(data['error'] == 1) {
            alert(data['message']);
            return;
        } else {
            if(data['webAuthnChallenge']) {
                webauthnAuthenticate(data['webAuthnChallenge'], function(success, info) {
                    if(success) {
                        webAuthnInfo = info;
                        $('#bypassTwoFactorWebauthnCodeButton').hide();
                        $('#bypassTwoFactorWebauthnCodeVerifiedContainer').show();
                        $('#bypassTwoFactorWebauthnCodeVerifiedContainer').attr('data-verfied', 'true');
                        if($('#bypassTwoFactorEmailCodeVerifiedContainer').attr('data-verfied') == 'true' && $('#bypassTwoFactorWebauthnCodeVerifiedContainer').attr('data-verfied') == 'true') {
                            $('#bypassTwoFactorReadySubmitContainer').show();
                        }
                    } else {
                        if(info != "abort") alert(info);
                    }
                });
            } else {
                alert("We were unable to get the webauthn challenge.");
            }
        }
    }, "json");
}
```

---

TITLE: Implementing NextAuth.js useSession Hook for Frontend Authentication
DESCRIPTION: This example shows a React component using the `useSession` hook to check the user's sign-in status. It conditionally renders content based on whether a session exists, providing 'Sign in' or 'Sign out' buttons using `signIn` and `signOut` functions from `next-auth/react`.
SOURCE: https://next-auth.js.org/getting-started/example

LANGUAGE: JSX
CODE:

```
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

---

TITLE: Common DMARC DNS Record Parameters
DESCRIPTION: This snippet provides a comprehensive reference for various DMARC parameters used in DNS TXT records. Each parameter controls a specific aspect of DMARC, such as protocol version, reporting, policy application, and alignment modes.
SOURCE: https://resend.com/docs/dashboard/domains/dmarc

LANGUAGE: DNS/DMARC Policy
CODE:

```
v
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
v=DMARC1
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
pct
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
pct=20
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
ruf
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
ruf=mailto:authfail@example.com
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
rua
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
rua=mailto:aggrep@example.com
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
p
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
p=quarantine
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
sp
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
sp=reject
```

LANGUAGE: DNS/DMARC Policy
CODE:

```
adkim
```

---

TITLE: Verifying Svix Webhooks in NestJS Controller
DESCRIPTION: This code defines a NestJS controller for handling incoming webhooks. It uses the `svix` library to verify the webhook payload against a secret, extracting the raw body and headers from the request. Error handling is included for verification failures.
SOURCE: https://docs.svix.com/receiving/verifying-payloads/how

LANGUAGE: TypeScript
CODE:

```
// webhook.controller.tsimport { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';import { Request } from 'express';import { Webhook } from 'svix';@Controller('webhook')class WebhookController {  @Post()  webhook(@Req() request: RawBodyRequest<Request>) {    const secret = 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw';    const wh = new Webhook(secret);    const payload = request.rawBody.toString('utf8');    const headers = request.headers;    let msg;    try {      msg = wh.verify(payload, headers);    } catch (err) {      // handle error    }    // Do something with the message...  }}
```

---

TITLE: Implementing Custom Tabbed Content Component in JavaScript
DESCRIPTION: This JavaScript class defines a `tabbed-content` custom HTML element. It provides functionality for creating accessible tabbed interfaces, managing tab selection, panel visibility, and keyboard navigation (ArrowLeft, ArrowRight, Home, End). It uses `TabStore` and `PanelStore` to manage associated tabs and panels, setting ARIA attributes for accessibility.
SOURCE: https://docs.astro.build/en/guides/server-side-rendering/

LANGUAGE: JavaScript
CODE:

```
class d extends HTMLElement{id=Math.floor(Math.random()*1e11).toString(32);count=0;TabStore=[];PanelStore=[];constructor(){super();const n=this.querySelectorAll(".panels > [id]"),s=this.querySelector(".tab-list"),t=s.querySelectorAll("a");s.setAttribute("role","tablist");let i=0;Array.prototype.forEach.call(t,(e,a)=>{e.setAttribute("role","tab"),e.setAttribute("id",this.id+"tab"+this.count++),e.setAttribute("tabindex","-1"),e.parentElement?.setAttribute("role","presentation"),this.TabStore[a]||this.TabStore.push(new Set),this.TabStore[a].add(e),"initial"in e.dataset&&e.dataset.initial!=="false"&&(i=a);const c=r=>{r.preventDefault();const o=s.querySelector("[aria-selected]");r.currentTarget!==o&&this.switchTab(r.currentTarget,a)};e.addEventListener("click",c),e.addEventListener("auxclick",c),e.addEventListener("keydown",r=>{const o=Array.prototype.indexOf.call(t,r.currentTarget),l=r.key==="ArrowLeft"?o-1:r.key==="ArrowRight"?o+1:r.key==="Home"?0:r.key==="End"?t.length-1:null;l!==null&&(r.preventDefault(),t[l]&&this.switchTab(t[l],l))})}),Array.prototype.forEach.call(n,(e,a)=>{e.setAttribute("role","tabpanel"),e.setAttribute("tabindex","-1"),e.setAttribute("aria-labelledby",t[a].id),e.hidden=!0,this.PanelStore[a]||this.PanelStore.push(new Set),this.PanelStore[a].add(e)}),t[i].removeAttribute("tabindex"),t[i].setAttribute("aria-selected","true"),n[i].hidden=!1}switchTab(n,s){this.TabStore.forEach(t=>t.forEach(i=>{i.removeAttribute("aria-selected"),i.setAttribute("tabindex","-1")})),this.TabStore[s].forEach(t=>{t.removeAttribute("tabindex"),t.setAttribute("aria-selected","true")}),this.PanelStore.forEach(t=>t.forEach(i=>{i.hidden=!0})),this.PanelStore[s].forEach(t=>{t.hidden=!1}),n.focus()}}customElements.define("tabbed-content",d);
```

---

TITLE: Managing Dark Mode Preference in JavaScript
DESCRIPTION: This JavaScript snippet attempts to apply a 'dark' class to the document's root element based on user preferences stored in local storage or the system's preferred color scheme. It prioritizes local storage settings, falling back to system preference if no explicit setting is found, and includes a try...catch block for error handling.
SOURCE: https://resend.com/docs/knowledge-base/why-are-my-open-rates-not-accurate

LANGUAGE: JavaScript
CODE:

```
try { if (localStorage.isDarkMode === 'true') { document.documentElement.classList.add('dark'); } else if (localStorage.isDarkMode === 'false') { document.documentElement.classList.remove('dark'); } else if ((false && !('isDarkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) || true) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } } catch (_) {}
```

---

TITLE: Common X-RateLimit Header Fields
DESCRIPTION: This snippet lists the commonly used 'X-RateLimit' header fields for conveying rate limit information: 'X-RateLimit-Limit' (the total requests allowed), 'X-RateLimit-Remaining' (requests left), and 'X-RateLimit-Reset' (time until reset). These are widely adopted in various implementations.
SOURCE: https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers

LANGUAGE: Rate Limit Header Format
CODE:

```
X-RateLimit-Limit
```

LANGUAGE: Rate Limit Header Format
CODE:

```
X-RateLimit-Remaining
```

LANGUAGE: Rate Limit Header Format
CODE:

```
X-RateLimit-Reset
```

---

TITLE: Handling Account Creation Check in JavaScript
DESCRIPTION: This JavaScript function manages the client-side logic for checking account creation details. It handles UI updates (loading states, error messages), collects user input, integrates with hCaptcha or Cloudflare Turnstile for bot verification, and makes an AJAX POST request to the backend API to validate the account information. It processes the API response to either submit the form, prompt for email verification, or display errors.
SOURCE: https://porkbun.com/account/domainsSpeedy

LANGUAGE: JavaScript
CODE:

```
function accountCreateCheck(forceVerifyConfirmed) {
  $("#accountCreateButton_loading").show();
  $("#accountCreateButton").hide();
  $("#accountCreateErrorAlert").hide();
  $(".newAccountError").html('');
  var username = jQuery.trim($("#newAccountUsername").val());
  var email = jQuery.trim($("#newAccountEmail").val());
  var emailBackup = jQuery.trim($("#newAccountEmailBackup").val());
  var country = jQuery.trim($("#newAccountCountry").val());
  // var hCaptchaResponse = $('#accountCreateCheckHcaptcha').find("[name='h-captcha-response']").val();
  var cCaptchaResponse = $('#accountCreateCheckCcaptcha').find("[name='cf-turnstile-response']").val();
  // $.post("/api/user/accountCreateCheck", {username:username, email:email, country:country, forceVerifyConfirmed:forceVerifyConfirmed, hCaptchaResponse:hCaptchaResponse, emailBackup:emailBackup},
  $.post("/api/user/accountCreateCheck", {username:username, email:email, country:country, forceVerifyConfirmed:forceVerifyConfirmed, cCaptchaResponse:cCaptchaResponse, emailBackup:emailBackup}, function(data) {
    $("#accountCreateButton_loading").hide();
    $("#accountCreateButton").show();
    $('.formCsrf').val(getCookie('csrf_pb'));
    if(data['error'] == "1") {
      alert(data['message']);
    } else if(data['error'] == "0") {
      if(data['code'] == 'EMAILERRORS' || data['code'] == 'USERNAMEERRORS') {
        $('#accountCreateForm').submit();
      } else if(data['code'] == 'CODESENT') {
        // prompt for code
        $('#modal_verifySessionEmail').modal('show');
      } else if(data['code'] == 'EMAILVERIFIED') {
        $('#accountCreateForm').submit();
      } else if(data['code'] == 'CAPTCHAERROR') {
        alert(data['message']);
      } else if(data['code'] == 'FORCEIDVERIFY') {
        if(confirm("Your account will require ID verification before you will be allowed to use it. This means that you will need to upload official identification documents that match the name and contact information being used. Are you sure you want to continue?")) {
          accountCreateCheck('true');
        }
      }
    }
  }, "json");
}
```

---

TITLE: Initializing Resend Client with Environment Variable in Node.js
DESCRIPTION: This TypeScript/JavaScript snippet shows how to initialize the Resend client by securely accessing the API key from an environment variable using process.env.RESEND_API_KEY. This approach ensures that the API key is loaded at runtime without being hard-coded into the application.
SOURCE: https://resend.com/docs/knowledge-base/how-to-handle-api-keys

LANGUAGE: TypeScript
CODE:

```
const resend = new Resend(process.env.RESEND_API_KEY);
```

---

TITLE: Styling Screen Reader Text for Hiding in CSS
DESCRIPTION: This CSS rule hides content visually while keeping it accessible to screen readers. It sets dimensions to 1px, clips the path, hides overflow, and positions it absolutely off-screen. This ensures content is present for accessibility tools but not visible to sighted users.
SOURCE: https://wordpress.org/plugins/wp-mail-smtp/

LANGUAGE: CSS
CODE:

```
.screen-reader-text{word-wrap:normal!important;border:0;clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}
```

---

TITLE: Sending Email Two-Factor Authentication Code - JavaScript
DESCRIPTION: This JavaScript function sends a POST request to the backend to initiate the sending of a two-factor authentication code to the user's email address. It retrieves the username and password from the login form, handles the API response, and updates the UI to show the email code input field upon success or displays an alert on error.
SOURCE: https://porkbun.com/account/domainsSpeedy

LANGUAGE: JavaScript
CODE:

```
function bypassTwoFactorSendEmailCode() { var username = jQuery.trim($('#loginUsername').val()); var password = jQuery.trim($('#loginPassword').val()); $.post("/api/user/sendEmailCode", {username:username, password:password}, function(data) { if(data['error'] == 1) { alert(data['message']); } else { $('#bypassTwoFactorEmailCodeContainer').show(); $('#bypassTwoFactorEmailCodeSendContainer').hide(); } }, "json"); }
```

---

TITLE: Creating Resend API Key in Rust
DESCRIPTION: Initializes the Resend client with a given API key and then proceeds to create a new API key named 'Production' using the `api_keys.create` method. This snippet demonstrates asynchronous API interaction.
SOURCE: https://resend.com/docs/api-reference/api-keys/create-api-key

LANGUAGE: Rust
CODE:

```
let resend = Resend::new("re_xxxxxxxxx");

 let _api_key = resend
 .api_keys
 .create(CreateApiKeyOptions::new("Production"))
 .await?;

 Ok(())
}
```

---

TITLE: Adding One-Click Unsubscribe Headers in Shell
DESCRIPTION: This shell snippet demonstrates how to include the 'List-Unsubscribe' and 'List-Unsubscribe-Post' headers in email messages. These headers enable email clients to provide a one-click unsubscribe option, simplifying the opt-out process for users and improving compliance with new bulk sending requirements.
SOURCE: https://resend.com/blog/gmail-and-yahoo-bulk-sending-requirements-for-2024

LANGUAGE: sh
CODE:

```
List-Unsubscribe: <https://example.com/unsubscribe>
List-Unsubscribe-Post: List-Unsubscribe=One-Click

```

---

TITLE: Gating Astro Actions with Middleware (TypeScript)
DESCRIPTION: This example illustrates how to use Astro middleware to gate access to actions based on session presence. It utilizes `getActionContext` to identify action requests, specifically checking for client-side RPC calls, and returns a 403 Forbidden response if a required session cookie is missing, providing a global authorization layer.
SOURCE: https://docs.astro.build/en/guides/actions/

LANGUAGE: TypeScript
CODE:

```
import { defineMiddleware } from 'astro:middleware';import { getActionContext } from 'astro:actions';
export const onRequest = defineMiddleware(async (context, next) => {  const { action } = getActionContext(context);  // Check if the action was called from a client-side function  if (action?.calledFrom === 'rpc') {    // If so, check for a user session token    if (!context.cookies.has('user-session')) {      return new Response('Forbidden', { status: 403 });    }  }
  context.cookies.set('user-session', /* session token */);  return next();});
```

---

TITLE: Implementing Custom Error Handling
DESCRIPTION: Demonstrates custom error handling in an API route. It validates if an `id` parameter is an integer and throws a `400 Bad Request` error using `createError` if validation fails, ensuring proper API responses.
SOURCE: https://nuxt.com/docs/guide/directory-structure/server

LANGUAGE: TypeScript
CODE:

```
export default defineEventHandler((event) => {   const id = parseInt(event.context.params.id) as number   if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer'
    })
  }
  return 'All good'
 })
```

---

TITLE: Example DMARC DNS TXT Record for Policy Enforcement
DESCRIPTION: This DMARC DNS TXT record defines a policy for the domain 'sender.dmarcdomain.com'. It specifies DMARC protocol version 1, a 'reject' policy for non-aligned messages, applies to 100% of messages, and designates 'postmaster@dmarcdomain.com' as the recipient for aggregate reports. This configuration instructs email receivers to outright reject any emails that fail DMARC authentication for this domain.
SOURCE: https://dmarc.org/overview/

LANGUAGE: DNS
CODE:

```
"v=DMARC1;p=reject;pct=100;rua=mailto:postmaster@dmarcdomain.com"
```
