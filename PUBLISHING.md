# Manage and publish portfolio content

Use `/admin.html` on the host whose portfolio you want to edit. `/editor.html` is a compatibility link to the same protected dashboard. Visitors browse `/index.html` and search `/search.html`; they do not need an account.

## Admin workflow

1. Complete [ADMIN_SETUP.md](ADMIN_SETUP.md) for your Cloudflare account, then sign in.
2. Import the existing portfolio once.
3. Select Projects, Labs, Badges or Blog, then create a new entry or select one to edit.
4. Enter a title, summary, topics, date, full content and optional supporting link. Badges have an issuer; blog posts have an author.
5. Choose Draft to keep the entry private, or Published to make it visible to visitors. Save to the database, with no GitHub commit needed for content changes.
6. Preview before publishing. Delete permanently removes an entry. The dashboard reports conflicts if another session changed the entry while you were editing it.

Drafts are restricted by server authorization, not merely hidden by the UI. Browser storage is not the content database. Dashboard backups include drafts and must remain private.

## Public portfolio

Published projects, labs, badges and blog posts are returned by `/api/content`. The portfolio search filters by content type and searches titles, summaries and topics. Existing article and work-detail links continue to resolve. The contact section shows plain details; footer links provide email, phone, GitHub and LinkedIn destinations.

The sample badge cards are labeled samples, not earned credentials. Replace them with real details and a verification link, and clear the Sample flag. The badge carousel moves right to left and respects reduced motion.

## Shared appearance

All public pages use one navigation component, in the order Home, Badges, Skills, Experience, About, Projects, Labs, Blog, PSudo IT, Contact. Small screens use a scrollable modal sidebar. Search is available from the header and footer; admin sign-in is separate from the main menu.

The cybersecurity background runs automatically, respects reduced motion, and suspends while the tab is hidden. The animated loader appears on initial visits, refreshes and page changes, with a timeout and reduced-motion support. Same-page section links scroll without replaying it.

The planned PSudo IT Solution business remains marked Coming soon. Its inquiry form opens the visitor's email app; it does not automatically send or save submissions.

## Separate deployments

The private ChatGPT review copy and your public Cloudflare Worker have separate databases and sign-in configuration. Editing content on one does not update the other. GitHub stores the application source and seed content, while the active content lives in the selected host's database.
