# Content and publishing

## Add your work

1. Open Content editor (`/editor.html`). Create or edit a project, lab practical, or badge.
2. Enter a summary, tools, date, full write-up, and optional source or verification URL.
3. Set visibility to Published for an entry that should appear to visitors.
4. Save the browser draft, then download `content.json`.
5. Replace `public/data/content.json` on the GitHub deployment branch and commit. The host builds the React app and deploys the change.

Draft entries are hidden by the interface but remain readable in the public JSON. Keep private information out of committed files. The private ChatGPT review copy needs a separate refresh.

Publishing is authorized by GitHub login. The browser editor is public and saves drafts only on that browser/device. It cannot upload directly to a server; it is not a backend admin dashboard. No API token or admin password is stored in the frontend.

## Badges

The initial badge cards are samples, not earned credentials. Add a real title, issuer, and verification URL, and clear Sample to show an earned badge. The carousel moves right to left and pauses on hover, keyboard focus, or its pause button. Reduced motion disables animation.

## Business inquiries

The planned PSudo IT Solution page is marked Coming soon. Its form opens the visitor's email application addressed to malingawelagedara523@gmail.com; it does not automatically send email or store submissions.

## Shared navigation and effects

The menu is defined once in `src/components/Navigation.jsx`. All routes use it. At widths of 1240 px and below it becomes a scrollable modal sidebar, with Escape/backdrop dismissal, focus containment, and scroll locking.

The homepage background combines a shield-and-circuit illustration at `public/image/cybersecurity-background.webp` with animated zoom, scan light, code streams, and circuit nodes. Pause background, reduced motion, and hidden tabs suspend animations.

One React cursor effect is shared by all pages. It activates only after mouse movement, stays above the header, and enters the sidebar's native top layer. Touch, reduced motion, and form controls retain the native cursor. Route changes and unmounting clean up animation frames, event handlers, and observers.

## Initial loading screen

The HTML entrypoint includes an immediate animated fallback before React loads. React then displays a cybersecurity shield loader while content and the homepage image load, fades it out, and enables the page. It runs on first visits, refreshes and internal page changes, including work-detail links and browser Back/Forward. Same-page section links do not restart it. After loading, focus moves to the new page content for keyboard navigation. A timeout dismisses the overlay, failed requests show the existing Retry control, and missing images do not block entry. Reduced motion disables loader animation.
