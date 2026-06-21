import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as UI from './dist/index.mjs';
import { writeFileSync } from 'node:fs';
const names = ['InsightCard','GoalProgress','HabitRow','MealEntry','DataSourceCard','ActivityTimeline'];
const cards = names.map((n) => {
  let inner = '';
  try { inner = renderToStaticMarkup(React.createElement(UI[n])); }
  catch (e) { inner = '<pre style="color:#FF4D6D;white-space:pre-wrap">'+n+': '+e.message+'</pre>'; }
  return `<div class="cell"><div class="lbl">&lt;${n}/&gt;</div>${inner}</div>`;
}).join('\n');
const html = `<!doctype html><html><head><meta charset="utf8">
<link rel="stylesheet" href="file:///Users/miron/app/lockin90-ui-kit/packages/tokens/dist/tokens.css">
<link rel="stylesheet" href="file:///Users/miron/app/lockin90-ui-kit/packages/ui/dist/styles.css">
<style>body{background:radial-gradient(120% 80% at 50% 0%,#141925,#05060b 70%);padding:34px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px}
.cell{min-width:0}.lbl{font-family:var(--font-mono);color:var(--text-faint);font-size:11px;letter-spacing:.1em;margin-bottom:10px}</style>
</head><body class="lk-app">${cards}</body></html>`;
writeFileSync('/tmp/kit-harness.html', html);
console.log('OK rendered', names.length, 'components');
