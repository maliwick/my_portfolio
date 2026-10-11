"""Regenerate the same static navigation on every portfolio page."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
LINKS = [('Home','index.html'),('About','index.html#about'),('Skills','index.html#skills'),('Projects','projects.html'),('Labs','labs.html'),('Experience','index.html#experience'),('Badges','index.html#badges'),('PSudo IT','business/index.html'),('Blog','blog.html'),('Contact','index.html#contact')]
def markup(prefix):
    links=''.join(f'<a href="{prefix}{url}" data-site-link>{label}</a>' for label,url in LINKS)
    return f'''<!-- SHARED NAV START -->
<a class="site-skip" href="#page-content">Skip to content</a>
<header id="site-header"><a class="site-brand" href="{prefix}index.html"><span class="site-mark" aria-hidden="true">M<span>.</span></span><span>M.T. MALINGA<small>CYBER SECURITY / IT</small></span></a><nav id="site-desktop" class="site-links" aria-label="Main navigation">{links}</nav><button id="site-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="site-drawer"><span aria-hidden="true">☰</span> Menu</button></header>
<dialog id="site-drawer" aria-labelledby="site-drawer-title"><div class="site-drawer-top"><h2 id="site-drawer-title">Navigation</h2><form method="dialog"><button id="site-menu-close" type="submit" aria-label="Close navigation menu">✕</button></form></div><nav class="site-links" aria-label="Mobile navigation">{links}</nav><div class="site-drawer-footer"><a href="https://github.com/maliwick" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/thisaramalinga523cyber/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></dialog>
<!-- SHARED NAV END -->'''
for page in [*ROOT.glob('*.html'),ROOT/'business/index.html']:
    text=page.read_text();prefix='../' if page.parent.name=='business' else ''
    shared=markup(prefix)
    if '<!-- SHARED NAV START -->' in text:
        text=re.sub(r'<!-- SHARED NAV START -->.*?<!-- SHARED NAV END -->',shared,text,flags=re.S)
    else:
        text=re.sub(r'<(?:nav|div) class="sidebar"[^>]*>.*?</(?:nav|div)>','',text,flags=re.S)
        # The home sidebar contains nested divs: remove its full block up to the hero.
        text=re.sub(r'<!-- Mobile Sidebar -->.*?(?=<section class="hero")','',text,flags=re.S)
        text=re.sub(r'<div class="sidebar-overlay"[^>]*></div>','',text)
        text=re.sub(r'<header\b.*?</header>','',text,flags=re.S)
        text=re.sub(r'(<body[^>]*>)',r'\1\n'+shared,text,count=1)
        text=re.sub(r'<script>\s*function openSidebar\(\).*?</script>','',text,flags=re.S)
    if 'navigation.css' not in text:
        text=text.replace('</head>',f'<link rel="stylesheet" href="{prefix}navigation.css"><script src="{prefix}navigation.js" defer></script></head>')
    if 'id="page-content"' not in text:
        if '<main' in text:text=re.sub(r'<main\b', '<main id="page-content" tabindex="-1"',text,count=1)
        elif '<section' in text:text=re.sub(r'<section\b','<section id="page-content" tabindex="-1"',text,count=1)
    # Existing home hero has its own anchor; put the skip target on its container instead.
    text=text.replace('<section id="page-content" tabindex="-1" class="hero" id="home">','<section class="hero" id="home" tabindex="-1">')
    if 'id="page-content"' not in text:text=text.replace('<div class="container">','<div class="container" id="page-content" tabindex="-1">',1)
    page.write_text(text)
