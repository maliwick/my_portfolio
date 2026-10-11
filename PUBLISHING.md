# Portfolio content and publishing

- `projects.html`: searchable projects, with full entries at `work.html`.
- `labs.html`: searchable lab practicals and write-ups.
- `business/index.html`: PSudo IT Solution, presented as a planned business.
- `editor.html`: a browser draft editor; it is not a server-authenticated admin dashboard.
- `data/content.json`: the shared public content source.

## Add your work

1. Open Content editor and create a project, lab practical, or badge.
2. Enter a summary, tools, date, full write-up, and optional source or verification URL.
3. Set visibility to Published for items that should appear on the site. Draft entries are hidden by the UI, but their text is still in the JSON; keep private information out of files committed to this public repository.
4. Save the browser draft, then download content.json.
5. Replace data/content.json on your GitHub deployment branch and commit. A host connected to that branch deploys the change. The separate private ChatGPT preview is not connected to GitHub auto-deployment.

Publishing is authorized by GitHub login. No API token or admin password is stored in the public frontend. Browser drafts are local to one browser/device. The editor cannot upload content directly to a server. For direct dashboard publishing, add an authenticated backend or CMS in a separate change.

## Badges

The included badge cards are design samples, not earned credentials. To show a real badge, enter its title, issuer, and verification URL, and clear the Sample checkbox. The homepage scrolls from right to left. Hover, keyboard focus, or Pause motion stops the carousel. Reduced-motion preferences disable animation.

## Business page

The inquiry form prepares an email in the visitor's email application to malingawelagedara523@gmail.com. It does not send messages automatically or store inquiries.

## Run locally

From the repository folder:

    python -m http.server 8000

Open http://localhost:8000. A server is required because the portfolio fetches content.json.

## Shared navigation

All HTML pages use navigation.css and navigation.js. The static header and mobile dialog are generated from one menu definition in tools/sync-navigation.py. After changing that definition, run `python tools/sync-navigation.py` from the repository folder. The desktop menu switches to a modal sidebar at widths of 1240 px or below.

## Background and cursor

The homepage background uses background.css and background.js (no video downloads). Pause background stops both the ambient gradients and canvas network. Reduced-motion settings disable animation; animation also pauses in hidden tabs.

Every page loads one shared cursor.css/cursor.js pair. The custom cursor activates only after a mouse move on a fine-pointer device, stays above the fixed menu, and moves inside the native modal sidebar when open. Touch, reduced motion, text fields, and select controls use the native cursor.

The homepage uses image/cybersecurity-background.webp, an AI-generated green/cyan shield and circuit-board illustration. CSS applies a slow zoom/drift and moving scan light. The same Pause background control and reduced-motion preferences stop those image animations.
