import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type IconName =
  // core (original 11)
  | 'back'
  | 'chevron'
  | 'share'
  | 'more'
  | 'lock'
  | 'play'
  | 'info'
  | 'timer'
  | 'plus'
  | 'check'
  | 'star'
  // content / block types
  | 'image'
  | 'text'
  | 'heading'
  | 'quote'
  | 'embed'
  | 'code'
  | 'grid'
  | 'table'
  | 'columns'
  | 'list'
  | 'listOrdered'
  // text formatting
  | 'bold'
  | 'italic'
  | 'link'
  | 'unlink'
  | 'externalLink'
  // files / media
  | 'file'
  | 'fileText'
  | 'video'
  | 'folder'
  | 'folderOpen'
  // editor actions
  | 'grip'
  | 'eye'
  | 'eyeOff'
  | 'copy'
  | 'duplicate'
  | 'trash'
  | 'edit'
  | 'save'
  | 'translate'
  | 'settings'
  | 'search'
  | 'close'
  // data / lists
  | 'calendar'
  | 'filter'
  | 'sort'
  | 'upload'
  | 'download'
  // status / feedback
  | 'sparkle'
  | 'warning'
  | 'checkCircle'
  | 'xCircle'
  | 'refresh'
  // navigation
  | 'chevronDown'
  | 'chevronUp'
  | 'bell'
  | 'user'
  // misc
  | 'palette'
  | 'crop'
  // mood faces (escalating)
  | 'mood-rough'
  | 'mood-low'
  | 'mood-ok'
  | 'mood-good'
  | 'mood-great'
  // provider / brand marks (monochrome silhouettes)
  | 'oura'
  | 'whoop'
  | 'garmin'
  | 'polar'
  | 'apple-health'
  | 'dexcom'
  | 'strava'
  // bottom-nav
  | 'home'
  | 'activity';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  /** pixel size of the rendered glyph (width = height) */
  size?: number;
}

/** Inner SVG geometry per glyph — drawn with currentColor strokes. */
const GLYPHS: Record<IconName, ReactNode> = {
  back: <polyline points="15 6 9 12 15 18" />,
  chevron: <polyline points="9 6 15 12 9 18" />,
  share: (
    <>
      <path d="M12 3v12" />
      <polyline points="8 7 12 3 16 7" />
      <path d="M7 11H5v9h14v-9h-2" />
    </>
  ),
  more: (
    <g fill="currentColor" stroke="none">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </g>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  play: (
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  timer: (
    <>
      <line x1="9" y1="3" x2="15" y2="3" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <circle cx="12" cy="14" r="8" />
      <path d="M12 14V9.5" />
      <path d="M12 14l3 2" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  check: <polyline points="5 12.5 10 17.5 19 6.5" />,
  home: <path d="M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9" />,
  activity: <path d="M4 19V11M9 19V5M14 19v-6M19 19V9" />,
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L12 17.1l-5.25 2.76 1-5.86L3.5 9.66l5.9-.86z" />
  ),

  // ── content / block types ───────────────────────────────────────────────
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M4 17l4.5-4.5 3.5 3.5 3-3 5 5" />
    </>
  ),
  text: (
    <>
      <line x1="5" y1="6.5" x2="19" y2="6.5" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="5" y1="17.5" x2="13" y2="17.5" />
    </>
  ),
  heading: (
    <>
      <path d="M6 5v14" />
      <path d="M14 5v14" />
      <line x1="6" y1="12" x2="14" y2="12" />
      <path d="M17 9.5l2-1V19" />
    </>
  ),
  quote: (
    <>
      <path d="M9 7H5.5A1.5 1.5 0 0 0 4 8.5V12a1.5 1.5 0 0 0 1.5 1.5H8v2A1.5 1.5 0 0 1 6.5 17" />
      <path d="M20 7h-3.5A1.5 1.5 0 0 0 15 8.5V12a1.5 1.5 0 0 0 1.5 1.5H19v2A1.5 1.5 0 0 1 17.5 17" />
    </>
  ),
  embed: (
    <>
      <polyline points="9 8 5 12 9 16" />
      <polyline points="15 8 19 12 15 16" />
    </>
  ),
  code: (
    <>
      <polyline points="8 7 3 12 8 17" />
      <polyline points="16 7 21 12 16 17" />
      <line x1="13.5" y1="5" x2="10.5" y2="19" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  table: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="3.5" y1="14.5" x2="20.5" y2="14.5" />
      <line x1="9.5" y1="5" x2="9.5" y2="19" />
    </>
  ),
  columns: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <line x1="12" y1="5" x2="12" y2="19" />
    </>
  ),
  list: (
    <>
      <line x1="9" y1="7" x2="20" y2="7" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="17" x2="20" y2="17" />
      <g fill="currentColor" stroke="none">
        <circle cx="4.5" cy="7" r="1.2" />
        <circle cx="4.5" cy="12" r="1.2" />
        <circle cx="4.5" cy="17" r="1.2" />
      </g>
    </>
  ),
  listOrdered: (
    <>
      <line x1="10" y1="7" x2="20" y2="7" />
      <line x1="10" y1="12" x2="20" y2="12" />
      <line x1="10" y1="17" x2="20" y2="17" />
      <path d="M4 5.5L5.2 5v4" />
      <path d="M3.6 14.4a1 1 0 0 1 1.8.6c0 .7-1.8 1.4-1.8 2.5h1.9" />
    </>
  ),

  // ── text formatting ─────────────────────────────────────────────────────
  bold: (
    <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
  ),
  italic: (
    <>
      <line x1="10" y1="5" x2="17" y2="5" />
      <line x1="7" y1="19" x2="14" y2="19" />
      <line x1="14" y1="5" x2="10" y2="19" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.66 0l2.34-2.34a4 4 0 1 0-5.66-5.66L11 7.34" />
      <path d="M14 10a4 4 0 0 0-5.66 0L6 12.34a4 4 0 1 0 5.66 5.66L13 16.66" />
    </>
  ),
  unlink: (
    <>
      <path d="M16 7l1.5-1.5a4 4 0 0 1 5.66 5.66L21 13" />
      <path d="M8 17l-1.5 1.5a4 4 0 0 1-5.66-5.66L3 11" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </>
  ),
  externalLink: (
    <>
      <path d="M14 5h5v5" />
      <line x1="11" y1="13" x2="19" y2="5" />
      <path d="M18 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.5" />
    </>
  ),

  // ── files / media ───────────────────────────────────────────────────────
  file: (
    <>
      <path d="M13 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5z" />
      <polyline points="13 3.5 13 9.5 19 9.5" />
    </>
  ),
  fileText: (
    <>
      <path d="M13 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5z" />
      <polyline points="13 3.5 13 9.5 19 9.5" />
      <line x1="8.5" y1="13" x2="15.5" y2="13" />
      <line x1="8.5" y1="16.5" x2="15.5" y2="16.5" />
    </>
  ),
  video: (
    <>
      <rect x="3.5" y="6" width="12" height="12" rx="2.5" />
      <path d="M15.5 10l5-2.5v9l-5-2.5z" />
    </>
  ),
  folder: (
    <path d="M4 7a2 2 0 0 1 2-2h3l2 2.5h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
  ),
  folderOpen: (
    <>
      <path d="M4 7a2 2 0 0 1 2-2h3l2 2.5h7a2 2 0 0 1 2 2V11" />
      <path d="M3 11.5h18l-2.2 7A1.5 1.5 0 0 1 17.3 19.5H6.5a1.5 1.5 0 0 1-1.5-1.1z" />
    </>
  ),

  // ── editor actions ──────────────────────────────────────────────────────
  grip: (
    <g fill="currentColor" stroke="none">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </g>
  ),
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M9.6 6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.6" />
      <path d="M6.4 7.6A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9.3 9.3 0 0 0 3-.5" />
      <path d="M9.9 9.9a2.75 2.75 0 0 0 3.9 3.9" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M5.5 15.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h9A1.5 1.5 0 0 1 15.5 5v.5" />
    </>
  ),
  duplicate: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M5.5 15.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h9A1.5 1.5 0 0 1 15.5 5v.5" />
      <line x1="14" y1="11.5" x2="14" y2="16.5" />
      <line x1="11.5" y1="14" x2="16.5" y2="14" />
    </>
  ),
  trash: (
    <>
      <polyline points="4 6.5 20 6.5" />
      <path d="M6 6.5V19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.5" />
      <path d="M9 6.5V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <line x1="10" y1="10.5" x2="10" y2="16.5" />
      <line x1="14" y1="10.5" x2="14" y2="16.5" />
    </>
  ),
  edit: (
    <>
      <path d="M13.5 6.5l4 4L9 19l-4.5 1 1-4.5z" />
      <path d="M15.5 4.5l1.5-1.5a1.8 1.8 0 0 1 2.5 0l1.5 1.5a1.8 1.8 0 0 1 0 2.5l-1.5 1.5z" />
    </>
  ),
  save: (
    <>
      <path d="M5.5 3.5h10.5L20.5 8v10.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z" />
      <path d="M7.5 3.5v5h7v-5" />
      <rect x="7.5" y="12.5" width="9" height="8" rx="1" />
    </>
  ),
  translate: (
    <>
      <path d="M3.5 6h8" />
      <path d="M7.5 6V4.5" />
      <path d="M9.5 6c0 4-3 7.5-6 8.5" />
      <path d="M4.5 9.5c0 2 2 3.8 5 4.5" />
      <path d="M12 20.5l4-10 4 10" />
      <line x1="13.4" y1="17" x2="18.6" y2="17" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5l1.4 2.3 2.6-.6.4 2.7 2.4 1.2-1.2 2.4 1.2 2.4-2.4 1.2-.4 2.7-2.6-.6L12 21.5l-1.4-2.3-2.6.6-.4-2.7L5.2 16l1.2-2.4L5.2 11.2l2.4-1.2.4-2.7 2.6.6z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="20.5" y2="20.5" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),

  // ── data / lists ────────────────────────────────────────────────────────
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="3" x2="8" y2="6.5" />
      <line x1="16" y1="3" x2="16" y2="6.5" />
    </>
  ),
  filter: (
    <path d="M4 5.5h16l-6.2 7.4V19l-3.6 1.8v-7.9z" />
  ),
  sort: (
    <>
      <line x1="4" y1="7" x2="14" y2="7" />
      <line x1="4" y1="12" x2="11" y2="12" />
      <line x1="4" y1="17" x2="8" y2="17" />
      <polyline points="16 14 18.5 16.5 21 14" />
      <line x1="18.5" y1="7" x2="18.5" y2="16.5" />
    </>
  ),
  upload: (
    <>
      <path d="M4 16v2.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V16" />
      <polyline points="8 8 12 4 16 8" />
      <line x1="12" y1="4" x2="12" y2="15" />
    </>
  ),
  download: (
    <>
      <path d="M4 16v2.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V16" />
      <polyline points="8 11 12 15 16 11" />
      <line x1="12" y1="4" x2="12" y2="15" />
    </>
  ),

  // ── status / feedback ───────────────────────────────────────────────────
  sparkle: (
    <path d="M12 3l1.6 5.2a3 3 0 0 0 2.2 2.2L21 12l-5.2 1.6a3 3 0 0 0-2.2 2.2L12 21l-1.6-5.2a3 3 0 0 0-2.2-2.2L3 12l5.2-1.6a3 3 0 0 0 2.2-2.2z" />
  ),
  warning: (
    <>
      <path d="M10.3 4.3a2 2 0 0 1 3.4 0l7.5 13A2 2 0 0 1 19.5 20.3h-15a2 2 0 0 1-1.7-3z" />
      <line x1="12" y1="9.5" x2="12" y2="14" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8 12.5 11 15.5 16 9" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-13.7-4.4L3.5 9" />
      <polyline points="3.5 4 3.5 9 8.5 9" />
      <path d="M4 13a8 8 0 0 0 13.7 4.4L20.5 15" />
      <polyline points="20.5 20 20.5 15 15.5 15" />
    </>
  ),

  // ── navigation ──────────────────────────────────────────────────────────
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  chevronUp: <polyline points="6 15 12 9 18 15" />,
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 4.5 1.5 5.5 2 6.5H4c.5-1 2-2 2-6.5z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.75" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),

  // ── misc ────────────────────────────────────────────────────────────────
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 2-2 0-.6-.3-1-.7-1.4-.4-.4-.6-.8-.6-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-3.6-3.8-6.5-9-6.5z" />
      <circle cx="8" cy="11" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  crop: (
    <>
      <path d="M7 2.5v14.5h14.5" />
      <path d="M2.5 7H17v14.5" />
    </>
  ),

  // ── mood faces (escalating) ──────────────────────────────────────────────
  'mood-rough': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8 16.5a4.5 4.5 0 0 1 8 0" />
    </>
  ),
  'mood-low': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8.5 16a4 4 0 0 1 7 0" />
    </>
  ),
  'mood-ok': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <line x1="8.5" y1="15.5" x2="15.5" y2="15.5" />
    </>
  ),
  'mood-good': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8.5 14.5a4 4 0 0 0 7 0" />
    </>
  ),
  'mood-great': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <path d="M7.5 14a4.5 4.5 0 0 0 9 0" />
    </>
  ),

  // ── provider / brand marks (monochrome silhouettes) ──────────────────────
  oura: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
  whoop: <path d="M3 12h4l2.5-7 5 14 2.5-7H21" />,
  garmin: (
    <path d="M12 3.5l8 15H4z" />
  ),
  polar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  'apple-health': (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
  ),
  dexcom: (
    <path d="M12 3.5C12 3.5 5 11 5 15a7 7 0 0 0 14 0c0-4-7-11.5-7-11.5z" />
  ),
  strava: (
    <>
      <path d="M12 3l-5.5 10h4L12 9l1.5 4h4z" />
      <path d="M14 13l-2 4-2-4" />
    </>
  ),
};

/** Shared inline-SVG icon set — color inherits from the parent via currentColor. */
export function Icon({ name, size = 18, className, ...rest }: IconProps) {
  return (
    <span className={cn('lk-icon', className)} {...rest}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {GLYPHS[name]}
      </svg>
    </span>
  );
}
