// ─── Constants ────────────────────────────────────────────────────────────────

// Godbolt Compiler Explorer — free, no key, designed for classroom use
// Compiler ID 'g132' = GCC 13.2. Browse alternatives at godbolt.org/api/compilers/c++
const GODBOLT_URL  = 'https://godbolt.org/api/compiler/g132/compile';
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
  const saved = getCookie('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved || preferred);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setCookie('theme', next);
  applyTheme(next);
}

// ─── Box Registry ─────────────────────────────────────────────────────────────

const BOX_TYPES = {
  rec:       (content) => makeBox('rec',       '↩ Recap',      content),
  important: (content) => makeBox('important', '⚠ Important',  content),
  trivia:    (content) => makeBox('trivia',    '◎ Trivia',     content),
  ref:       (content) => makeBox('ref',       '→ References', content),
  fold:      (content) => makeFold(content),
  playground:(content) => makePlayground(content),
};

// ─── Box Constructors ─────────────────────────────────────────────────────────

function makeBox(type, label, rawContent) {
  const el = document.createElement('div');
  el.className = `box box-${type}`;

  const labelEl = document.createElement('div');
  labelEl.className = 'box-label';
  labelEl.textContent = label;

  const body = document.createElement('div');
  body.className = 'box-body';
  body.innerHTML = marked.parse(rawContent.trim());

  el.appendChild(labelEl);
  el.appendChild(body);
  return el;
}

function makeFold(rawContent) {
  const details = document.createElement('details');
  details.className = 'box box-fold';

  // First line becomes the summary; rest is body
  const lines = rawContent.trim().split('\n');
  const summaryText = lines[0].replace(/^#+\s*/, '');
  const bodyText = lines.slice(1).join('\n').trim();

  const summary = document.createElement('summary');
  summary.className = 'box-label';
  summary.textContent = '▸ ' + summaryText;

  details.addEventListener('toggle', () => {
    summary.textContent = (details.open ? '▾ ' : '▸ ') + summaryText;
  });

  const body = document.createElement('div');
  body.className = 'box-body';
  if (bodyText) body.innerHTML = marked.parse(bodyText);

  details.appendChild(summary);
  details.appendChild(body);
  return details;
}

function makePlayground(rawContent) {
  const config = jsyaml.load(rawContent);
  const wrapper = document.createElement('div');
  wrapper.className = 'box box-playground';

  const label = document.createElement('div');
  label.className = 'box-label';
  label.textContent = '⌨ Exercise' + (config.id ? ` — ${config.id}` : '');

  const editor = document.createElement('textarea');
  editor.className = 'playground-editor';
  editor.spellcheck = false;
  editor.value = (config.default_code || '').trimEnd();

  const controls = document.createElement('div');
  controls.className = 'playground-controls';

  const runBtn = document.createElement('button');
  runBtn.className = 'playground-run';
  runBtn.textContent = 'Run';

  const clearBtn = document.createElement('button');
  clearBtn.className = 'playground-clear';
  clearBtn.textContent = 'Clear output';

  controls.appendChild(runBtn);
  controls.appendChild(clearBtn);

  const output = document.createElement('div');
  output.className = 'playground-output';
  output.textContent = '—';

  // SVG display area (hidden until SVG output is detected)
  const svgDisplay = document.createElement('div');
  svgDisplay.className = 'playground-svg';
  svgDisplay.style.display = 'none';

  runBtn.addEventListener('click', async () => {
    output.textContent = 'Compiling…';
    output.className = 'playground-output';
    svgDisplay.style.display = 'none';
    runBtn.disabled = true;

    const studentCode = editor.value;
    const fullCode = [
      config.boilerplate_before || '',
      studentCode,
      config.boilerplate_after  || '',
    ].join('\n');

    try {
      const res = await fetch(GODBOLT_URL, {
        method: 'POST',
        headers: GODBOLT_HEADERS,
        body: JSON.stringify({
          source: fullCode,
          options: {
            userArguments: '-std=c++17',
            executeParameters: { args: '', stdin: '' },
            compilerOptions: { executorRequest: true },
            filters: { execute: true },
            tools: [],
            libraries: [],
          },
        }),
      });

      const data = await res.json();

      // Godbolt returns execResult when execute:true
      const execResult  = data.execResult || data;
      const buildFailed = execResult.buildResult?.code !== 0;
      const compileErr  = execResult.buildResult?.stderr?.map(l => l.text).join('\n').trim() || '';
      const stdout      = execResult.stdout?.map(l => l.text).join('\n').trim() || '';
      const stderr      = execResult.stderr?.map(l => l.text).join('\n').trim()  || '';

      if (buildFailed && compileErr) {
        output.textContent = compileErr;
        output.className = 'playground-output error';
      } else if (stdout.startsWith('<svg')) {
        // SVG mode: render frames with scrubber
        renderSVGFrames(svgDisplay, stdout);
        svgDisplay.style.display = 'block';
        output.style.display = 'none';
      } else {
        output.style.display = 'block';
        output.textContent = stdout + (stderr ? '\n--- stderr ---\n' + stderr : '') || '(no output)';
        output.className = 'playground-output';
      }
    } catch (err) {
      output.textContent = 'Network error: ' + err.message;
      output.className = 'playground-output error';
    }

    runBtn.disabled = false;
  });

  clearBtn.addEventListener('click', () => {
    output.textContent = '—';
    output.className = 'playground-output';
    output.style.display = 'block';
    svgDisplay.style.display = 'none';
    svgDisplay.innerHTML = '';
  });

  wrapper.appendChild(label);
  wrapper.appendChild(editor);
  wrapper.appendChild(controls);
  wrapper.appendChild(output);
  wrapper.appendChild(svgDisplay);
  return wrapper;
}

// ─── SVG Frame Scrubber ───────────────────────────────────────────────────────

function renderSVGFrames(container, rawOutput) {
  container.innerHTML = '';

  const DELIMITER = '---FRAME---';
  const frames = rawOutput.includes(DELIMITER)
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
    label.className = 'svg-frame-label';
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

// ─── Markdown Post-Processor ──────────────────────────────────────────────────

function mountBoxes(root) {
  root.querySelectorAll('code[class^="language-"]').forEach(code => {
    const lang = code.className.replace('language-', '');
    if (!BOX_TYPES[lang]) return;

    const pre = code.parentElement; // marked wraps in <pre>
    const box = BOX_TYPES[lang](code.textContent);
    pre.replaceWith(box);
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
  initTheme();
  const root = document.getElementById('lesson-root');

  try {
    const res  = await fetch(mdPath);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const text = await res.text();

    root.innerHTML = `<article class="lesson">${marked.parse(text)}</article>`;
    mountBoxes(root);
  } catch (err) {
    root.innerHTML = `<p class="load-error">Could not load page: ${err.message}</p>`;
  }
}

// Resolve ?lesson= param, e.g. ?lesson=01-types → lessons/01-types.md
function pageFromURL(fallback) {
  const param = new URLSearchParams(window.location.search).get('page');
  return param ? `pages/${param}.md` : fallback;
}
