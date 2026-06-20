// ─── Constants ────────────────────────────────────────────────────────────────

// Godbolt Compiler Explorer — free, no key, designed for classroom use
// Compiler ID 'g132' = GCC 13.2. Browse alternatives at godbolt.org/api/compilers/c++
const GODBOLT_URL     = 'https://godbolt.org/api/compiler/g132/compile';
const GODBOLT_HEADERS = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

// ─── Theme ────────────────────────────────────────────────────────────────────

function getCookie(name) {
  return document.cookie.split('; ').reduce((acc, part) => {
    const [k, v] = part.split('=');
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '◑ Dark';
}

function initTheme() {
  const saved     = getCookie('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || preferred);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  setCookie('theme', next);
  applyTheme(next);
  broadcastThemeToGadgets(next);
}

// ─── Marked Configuration ─────────────────────────────────────────────────────

marked.use({
  renderer: {
    // Headings starting with '>' or '<' become foldable sections:
    //   ## > Collapsed section title
    //   ## < Section that starts expanded
    // Note: by the time this renderer runs, marked has already inline-rendered
    // the heading text, which HTML-escapes '<' and '>' into entities. We match
    // on the escaped forms (and raw forms, just in case) for robustness.
    heading(text, level) {
      let fold = null;
      let clean = text;

      if (/^(&gt;|>)\s*/.test(text)) {
        fold = 'closed';
        clean = text.replace(/^(&gt;|>)\s*/, '');
      } else if (/^(&lt;|<)\s*/.test(text)) {
        fold = 'open';
        clean = text.replace(/^(&lt;|<)\s*/, '');
      }

      // id should be based on plain text, so strip any remaining tags/entities for slugging
      const plain = clean.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, '');
      const id = plain.toLowerCase().replace(/[^\w]+/g, '-');
      const foldAttr = fold ? ` data-fold="${fold}"` : '';
      return `<h${level} id="${id}"${foldAttr}>${clean}</h${level}>`;
    },

    // Parse fence info strings:
    //   ```rec              → default title, not foldable
    //   ```rec: My Title    → custom title, not foldable
    //   ```rec> My Title    → custom title, collapsed by default
    //   ```rec< My Title    → custom title, expanded by default
    //   ```rec>             → default title, collapsed (no title needed)
    code(code, infostring) {
      const info = (infostring || '').trim();

      // Find the first separator: ':', '>', or '<'
      const candidates = [':', '>', '<']
        .map(ch => ({ ch, i: info.indexOf(ch) }))
        .filter(x => x.i !== -1)
        .sort((a, b) => a.i - b.i);

      const sep   = candidates.length ? candidates[0] : null;
      const lang  = sep ? info.slice(0, sep.i).trim() : info;
      const title = sep ? info.slice(sep.i + 1).trim() : '';
      const fold  = sep && sep.ch !== ':' ? (sep.ch === '>' ? 'closed' : 'open') : null;

      const body = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const titleAttr = title ? ` data-title="${title.replace(/"/g, '&quot;')}"` : '';
      const foldAttr  = fold  ? ` data-fold="${fold}"`                            : '';

      return `<pre><code class="language-${lang}"${titleAttr}${foldAttr}>${body}\n</code></pre>`;
    }
  }
});

// ─── Box Registry ─────────────────────────────────────────────────────────────

const BOX_DEFAULTS = {
  rec:        '↩ Recap',
  important:  '⚠ Important',
  trivia:     '◎ Trivia',
  ref:        '→ References',
  info:       'ℹ Info',
  playground: '⌨ Exercise',
  gadget:     '◈ Interactive',
};

const BOX_TYPES = {
  rec:        (content, title, fold) => makeBox('rec',       title || BOX_DEFAULTS.rec,       content, fold),
  important:  (content, title, fold) => makeBox('important', title || BOX_DEFAULTS.important,  content, fold),
  trivia:     (content, title, fold) => makeBox('trivia',    title || BOX_DEFAULTS.trivia,     content, fold),
  ref:        (content, title, fold) => makeBox('ref',       title || BOX_DEFAULTS.ref,        content, fold),
  info:       (content, title, fold) => makeBox('info',      title || BOX_DEFAULTS.info,       content, fold),
  playground: (content, title, fold) => makePlayground(content, title, fold),
  gadget:     (content, title, fold) => makeGadget(content, title, fold),
};

// ─── Shared wrap helper ───────────────────────────────────────────────────────
// Wraps a content element in a plain box <div> or a foldable <details>,
// preserving the box type's colour and border either way.

function wrapBox(type, label, contentEl, fold) {
  if (fold) {
    const details = document.createElement('details');
    details.className = `box box-${type} box-foldable`;
    if (fold === 'open') details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'box-label';
    const arrow = () => details.open ? '▾ ' : '▸ ';
    summary.textContent = arrow() + label;
    details.addEventListener('toggle', () => {
      summary.textContent = arrow() + label;
    });

    details.appendChild(summary);
    details.appendChild(contentEl);
    return details;
  }

  const el = document.createElement('div');
  el.className = `box box-${type}`;

  const labelEl = document.createElement('div');
  labelEl.className = 'box-label';
  labelEl.textContent = label;

  el.appendChild(labelEl);
  el.appendChild(contentEl);
  return el;
}

// ─── Box Constructors ─────────────────────────────────────────────────────────

function makeBox(type, label, rawContent, fold) {
  const body = document.createElement('div');
  body.className = 'box-body';
  body.innerHTML = marked.parse(rawContent.trim());
  mountBoxes(body); // allow nested boxes inside any box (including foldable ones)
  return wrapBox(type, label, body, fold);
}

function makePlayground(rawContent, title, fold) {
  const config  = jsyaml.load(rawContent);
  const label   = title || (BOX_DEFAULTS.playground + (config.id ? ` — ${config.id}` : ''));
  const content = document.createElement('div');
  content.className = 'box-playground-content';

  const editor = document.createElement('textarea');
  editor.className  = 'playground-editor';
  editor.spellcheck = false;
  editor.value      = (config.default_code || '').trimEnd();

  const controls = document.createElement('div');
  controls.className = 'playground-controls';

  const runBtn = document.createElement('button');
  runBtn.className   = 'playground-run';
  runBtn.textContent = 'Run';

  const clearBtn = document.createElement('button');
  clearBtn.className   = 'playground-clear';
  clearBtn.textContent = 'Clear output';

  controls.appendChild(runBtn);
  controls.appendChild(clearBtn);

  const output = document.createElement('div');
  output.className   = 'playground-output';
  output.textContent = '—';

  const svgDisplay = document.createElement('div');
  svgDisplay.className    = 'playground-svg';
  svgDisplay.style.display = 'none';

  runBtn.addEventListener('click', async () => {
    output.textContent = 'Compiling…';
    output.className   = 'playground-output';
    svgDisplay.style.display = 'none';
    runBtn.disabled = true;

    const fullCode = [
      config.boilerplate_before || '',
      editor.value,
      config.boilerplate_after  || '',
    ].join('\n');

    try {
      const res  = await fetch(GODBOLT_URL, {
        method:  'POST',
        headers: GODBOLT_HEADERS,
        body: JSON.stringify({
          source: fullCode,
          options: {
            userArguments:   '-std=c++17',
            executeParameters: { args: '', stdin: '' },
            compilerOptions:   { executorRequest: true },
            filters:           { execute: true },
            tools:             [],
            libraries:         [],
          },
        }),
      });

      const data        = await res.json();
      const execResult  = data.execResult || data;
      const buildFailed = execResult.buildResult?.code !== 0;
      const compileErr  = execResult.buildResult?.stderr?.map(l => l.text).join('\n').trim() || '';
      const stdout      = execResult.stdout?.map(l => l.text).join('\n').trim() || '';
      const stderr      = execResult.stderr?.map(l => l.text).join('\n').trim() || '';

      if (buildFailed && compileErr) {
        output.textContent = compileErr;
        output.className   = 'playground-output error';
      } else if (stdout.startsWith('<svg')) {
        renderSVGFrames(svgDisplay, stdout);
        svgDisplay.style.display = 'block';
        output.style.display     = 'none';
      } else {
        output.style.display = 'block';
        output.textContent   = stdout + (stderr ? '\n--- stderr ---\n' + stderr : '') || '(no output)';
        output.className     = 'playground-output';
      }
    } catch (err) {
      output.textContent = 'Network error: ' + err.message;
      output.className   = 'playground-output error';
    }

    runBtn.disabled = false;
  });

  clearBtn.addEventListener('click', () => {
    output.textContent       = '—';
    output.className         = 'playground-output';
    output.style.display     = 'block';
    svgDisplay.style.display = 'none';
    svgDisplay.innerHTML     = '';
  });

  content.appendChild(editor);
  content.appendChild(controls);
  content.appendChild(output);
  content.appendChild(svgDisplay);
  return wrapBox('playground', label, content, fold);
}

// ─── SVG Frame Scrubber ───────────────────────────────────────────────────────

function renderSVGFrames(container, rawOutput) {
  container.innerHTML = '';

  const DELIMITER = '---FRAME---';
  const frames    = rawOutput.includes(DELIMITER)
    ? rawOutput.split(DELIMITER).map(s => s.trim()).filter(Boolean)
    : [rawOutput];

  const display = document.createElement('div');
  display.className = 'svg-display';
  display.innerHTML = frames[0];
  container.appendChild(display);

  if (frames.length > 1) {
    const scrubberWrap = document.createElement('div');
    scrubberWrap.className = 'svg-scrubber';

    const label = document.createElement('span');
    label.className   = 'svg-frame-label';
    label.textContent = `Frame 1 / ${frames.length}`;

    const slider = document.createElement('input');
    slider.type  = 'range';
    slider.min   = 0;
    slider.max   = frames.length - 1;
    slider.value = 0;

    slider.addEventListener('input', () => {
      const i = parseInt(slider.value);
      display.innerHTML = frames[i];
      label.textContent = `Frame ${i + 1} / ${frames.length}`;
    });

    scrubberWrap.appendChild(slider);
    scrubberWrap.appendChild(label);
    container.appendChild(scrubberWrap);
  }
}

// ─── Gadget (iframe) ─────────────────────────────────────────────────────────

function makeGadget(rawContent, title, fold) {
  const config = jsyaml.load(rawContent);

  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const sep   = config.src.includes('?') ? '&' : '?';

  const iframe = document.createElement('iframe');
  iframe.src           = `${config.src}${sep}theme=${theme}`;
  iframe.style.cssText = ['width:100%', `height:${config.height || 400}px`, 'border:none', 'display:block'].join(';');
  iframe.dataset.gadgetSrc = config.src; // base src, without theme param

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'gadget-height' && e.data.src === config.src)
      iframe.style.height = e.data.height + 'px';
  });

  return wrapBox('gadget', title || BOX_DEFAULTS.gadget, iframe, fold);
}

// Tells every mounted gadget iframe to switch theme live, instead of requiring a reload.
function broadcastThemeToGadgets(theme) {
  document.querySelectorAll('iframe[data-gadget-src]').forEach(iframe => {
    iframe.contentWindow?.postMessage({ type: 'set-theme', theme }, '*');
  });
}

// ─── Markdown Post-Processor ──────────────────────────────────────────────────

function mountBoxes(root) {
  root.querySelectorAll('code[class^="language-"]').forEach(code => {
    const lang = code.className.replace('language-', '');
    if (!BOX_TYPES[lang]) return;

    const title = code.dataset.title || null;
    const fold  = code.dataset.fold  || null;
    const pre   = code.parentElement;
    const box   = BOX_TYPES[lang](code.textContent, title, fold);
    pre.replaceWith(box);
  });
}

// Wraps foldable headings (## > Title / ## < Title) and everything until the
// next heading of the same or higher level into a <details> section.
// Processes deeper levels first (h3 before h2) so nesting falls out naturally.
function mountFoldingSections(root) {
  const isHeading = (el, maxLevel) => {
    if (!el.tagName || el.tagName[0] !== 'H') return false;
    const lvl = parseInt(el.tagName[1]);
    return !isNaN(lvl) && lvl <= maxLevel;
  };

  ['h3', 'h2'].forEach(tag => {
    const level = parseInt(tag[1]);
    root.querySelectorAll(`${tag}[data-fold]`).forEach(heading => {
      const fold = heading.dataset.fold;

      const siblings = [];
      let el = heading.nextElementSibling;
      while (el && !isHeading(el, level)) {
        const next = el.nextElementSibling;
        siblings.push(el);
        el = next;
      }

      const details = document.createElement('details');
      details.className = `section-fold section-fold-${tag}`;
      if (fold === 'open') details.open = true;

      const summary = document.createElement('summary');
      summary.className = `section-fold-summary ${tag}-summary`;

      const arrow = () => details.open ? '▾ ' : '▸ ';
      const titleText = heading.textContent;
      summary.textContent = arrow() + titleText;
      details.addEventListener('toggle', () => {
        summary.textContent = arrow() + titleText;
      });

      // Preserve heading id/level for anchor links and styling
      const innerHeading = document.createElement(tag);
      innerHeading.id = heading.id;
      innerHeading.style.display = 'none'; // visually replaced by summary, kept for anchors

      const body = document.createElement('div');
      body.className = 'section-fold-body';
      siblings.forEach(s => body.appendChild(s));

      details.appendChild(summary);
      details.appendChild(innerHeading);
      details.appendChild(body);
      heading.replaceWith(details);
    });
  });
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function buildShell() {
  document.body.innerHTML = `
    <header class="site-header">
      <nav class="lesson-nav" id="lesson-nav"></nav>
      <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()">◑ Dark</button>
    </header>
    <div id="lesson-root"></div>
  `;
}

async function loadPage(mdPath) {
  buildShell();
  initTheme(); // must run after buildShell so the toggle button exists
  const root = document.getElementById('lesson-root');

  try {
    const res  = await fetch(mdPath);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const text = await res.text();

    root.innerHTML = `<article class="lesson">${marked.parse(text)}</article>`;
    mountBoxes(root);
    mountFoldingSections(root);
  } catch (err) {
    root.innerHTML = `<p class="load-error">Could not load page: ${err.message}</p>`;
  }
}

// Resolve ?page= param: ?page=01-data → pages/01-data.md
function pageFromURL(fallback) {
  const param = new URLSearchParams(window.location.search).get('page');
  return param ? `pages/${param}.md` : fallback;
}
