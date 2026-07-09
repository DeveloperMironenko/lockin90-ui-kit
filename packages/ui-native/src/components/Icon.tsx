import { type ReactNode } from 'react';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import {
  ArrowDownWideNarrow,
  ArrowRight,
  Bell,
  Bold,
  Bookmark,
  Calendar,
  Camera,
  ChartColumn,
  ChartNoAxesColumn,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleX,
  Code,
  CodeXml,
  Coffee,
  Columns2,
  Copy,
  CopyPlus,
  CreditCard,
  Crop,
  Database,
  Download,
  Droplet,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileText,
  Flame,
  FlaskConical,
  Folder,
  FolderOpen,
  Funnel,
  Globe,
  GripVertical,
  Heading1,
  Heart,
  House,
  Image,
  Info,
  Italic,
  Languages,
  LayoutGrid,
  Link,
  List,
  ListOrdered,
  Lock,
  LogOut,
  Mail,
  Medal,
  MessageSquare,
  Mic,
  Moon,
  MoveVertical,
  Palette,
  Paperclip,
  Pencil,
  Pill,
  Play,
  Plus,
  Quote,
  RefreshCcw,
  Ruler,
  Save,
  ScanBarcode,
  Search,
  Send,
  Settings,
  Share,
  Shield,
  Smile,
  Sparkle,
  Star,
  Syringe,
  Table,
  Target,
  Text,
  Timer,
  Trash2,
  TriangleAlert,
  Unlink,
  Upload,
  User,
  Utensils,
  Video,
  Weight,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { colors } from '@lockin90/tokens';

export type IconName =
  // core (original 11)
  | 'back'
  | 'chevron'
  | 'chevronLeft'
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
  | 'activity'
  // nav / domain / brand (web rebuild)
  | 'energy'
  | 'sleep'
  | 'insights'
  | 'billing'
  | 'globe'
  | 'heart'
  | 'flame'
  | 'height'
  | 'weight'
  | 'arrow-right'
  | 'shield'
  | 'google'
  | 'apple'
  | 'stripe'
  // mobile domain
  | 'mail'
  | 'caffeine'
  | 'meal'
  | 'mood'
  | 'scale'
  | 'ruler'
  | 'card'
  | 'data-source'
  // consumer screens (chat / feed / nutrition / labs / vision / goals)
  | 'send'
  | 'attach'
  | 'emoji'
  | 'mic'
  | 'comment'
  | 'bookmark'
  | 'target'
  | 'medal'
  | 'drop'
  | 'utensil'
  | 'barcode-scan'
  | 'pill'
  | 'flask'
  | 'syringe'
  | 'camera'
  // session
  | 'logout';

export interface IconProps {
  name: IconName;
  /** pixel size of the rendered glyph (width = height) @default 18 */
  size?: number;
  /**
   * Glyph color. Native has no `currentColor` inheritance, so this stands in
   * for the web's parent-driven `currentColor`. @default colors.text
   */
  color?: string;
}

/**
 * Names that stay hand-drawn: brand marks Lucide doesn't ship (google, apple,
 * stripe + provider silhouettes) and the bespoke 5-step mood scale (its two
 * frown depths / two smile depths have no distinct Lucide equivalents).
 */
type CustomIconName =
  | 'mood-rough'
  | 'mood-low'
  | 'mood-ok'
  | 'mood-good'
  | 'mood-great'
  | 'oura'
  | 'whoop'
  | 'garmin'
  | 'polar'
  | 'apple-health'
  | 'dexcom'
  | 'strava'
  | 'google'
  | 'apple'
  | 'stripe';

/**
 * IconName → Lucide component.
 * ⚠️ KEEP IN SYNC with packages/ui/src/components/Icon.tsx — the two maps
 * must stay identical pair-for-pair (same IconName → same Lucide icon),
 * so web and native render the exact same glyph for every name.
 */
const LUCIDE: Record<Exclude<IconName, CustomIconName>, LucideIcon> = {
  // core
  back: ChevronLeft,
  chevron: ChevronRight,
  chevronLeft: ChevronLeft,
  share: Share,
  more: Ellipsis,
  lock: Lock,
  play: Play,
  info: Info,
  timer: Timer,
  plus: Plus,
  check: Check,
  star: Star,
  // content / block types
  image: Image,
  text: Text,
  heading: Heading1,
  quote: Quote,
  embed: Code,
  code: CodeXml,
  grid: LayoutGrid,
  table: Table,
  columns: Columns2,
  list: List,
  listOrdered: ListOrdered,
  // text formatting
  bold: Bold,
  italic: Italic,
  link: Link,
  unlink: Unlink,
  externalLink: ExternalLink,
  // files / media
  file: File,
  fileText: FileText,
  video: Video,
  folder: Folder,
  folderOpen: FolderOpen,
  // editor actions
  grip: GripVertical,
  eye: Eye,
  eyeOff: EyeOff,
  copy: Copy,
  duplicate: CopyPlus,
  trash: Trash2,
  edit: Pencil,
  save: Save,
  translate: Languages,
  settings: Settings,
  search: Search,
  close: X,
  // data / lists
  calendar: Calendar,
  filter: Funnel,
  sort: ArrowDownWideNarrow,
  upload: Upload,
  download: Download,
  // status / feedback
  sparkle: Sparkle,
  warning: TriangleAlert,
  checkCircle: CircleCheck,
  xCircle: CircleX,
  refresh: RefreshCcw,
  // navigation
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  bell: Bell,
  user: User,
  // misc
  palette: Palette,
  crop: Crop,
  // bottom-nav
  home: House,
  activity: ChartNoAxesColumn,
  // nav / domain
  energy: Zap,
  sleep: Moon,
  insights: ChartColumn,
  billing: CreditCard,
  globe: Globe,
  heart: Heart,
  flame: Flame,
  height: MoveVertical,
  weight: Weight,
  'arrow-right': ArrowRight,
  shield: Shield,
  // mobile domain
  mail: Mail,
  caffeine: Coffee,
  meal: Utensils,
  mood: Smile,
  scale: Weight,
  ruler: Ruler,
  card: CreditCard,
  'data-source': Database,
  // consumer screens
  send: Send,
  attach: Paperclip,
  emoji: Smile,
  mic: Mic,
  comment: MessageSquare,
  bookmark: Bookmark,
  target: Target,
  medal: Medal,
  drop: Droplet,
  utensil: Utensils,
  'barcode-scan': ScanBarcode,
  pill: Pill,
  flask: FlaskConical,
  syringe: Syringe,
  camera: Camera,
  // session
  logout: LogOut,
};

/** Hand-drawn glyphs (stroked with the resolved `color`) for names Lucide can't cover. */
const CUSTOM_GLYPHS: Record<CustomIconName, (color: string) => ReactNode> = {
  // ── mood faces (escalating) ──────────────────────────────────────────────
  'mood-rough': (color) => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="8.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Circle cx="15.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Path d="M8 16.5a4.5 4.5 0 0 1 8 0" />
    </>
  ),
  'mood-low': (color) => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="8.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Circle cx="15.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Path d="M8.5 16a4 4 0 0 1 7 0" />
    </>
  ),
  'mood-ok': (color) => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="8.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Circle cx="15.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Line x1="8.5" y1="15.5" x2="15.5" y2="15.5" />
    </>
  ),
  'mood-good': (color) => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="8.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Circle cx="15.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Path d="M8.5 14.5a4 4 0 0 0 7 0" />
    </>
  ),
  'mood-great': (color) => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="8.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Circle cx="15.5" cy="10" r="0.9" fill={color} stroke="none" />
      <Path d="M7.5 14a4.5 4.5 0 0 0 9 0" />
    </>
  ),

  // ── provider / brand marks (monochrome silhouettes) ──────────────────────
  oura: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="12" cy="12" r="4.5" />
    </>
  ),
  whoop: () => <Path d="M3 12h4l2.5-7 5 14 2.5-7H21" />,
  garmin: () => <Path d="M12 3.5l8 15H4z" />,
  polar: () => (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="12" cy="12" r="2.5" />
    </>
  ),
  'apple-health': () => (
    <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
  ),
  dexcom: () => (
    <Path d="M12 3.5C12 3.5 5 11 5 15a7 7 0 0 0 14 0c0-4-7-11.5-7-11.5z" />
  ),
  strava: () => (
    <>
      <Path d="M12 3l-5.5 10h4L12 9l1.5 4h4z" />
      <Path d="M14 13l-2 4-2-4" />
    </>
  ),
  google: () => (
    <G stroke="none">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <Path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </G>
  ),
  apple: (color) => (
    <Path
      fill={color}
      stroke="none"
      d="M16.37 12.78c.02 2.5 2.19 3.33 2.21 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.74-.66-1.27 0-1.67.64-2.72.68-1.1.04-1.93-1.1-2.63-2.11-1.43-2.07-2.53-5.86-1.06-8.42a4.1 4.1 0 0 1 3.46-2.1c1.08-.02 2.1.73 2.76.73.66 0 1.9-.9 3.2-.77.54.02 2.07.22 3.05 1.65-.08.05-1.82 1.07-1.8 3.21M14.3 4.6c.58-.71.98-1.69.87-2.68-.84.04-1.86.56-2.47 1.26-.54.62-1.02 1.62-.89 2.58.94.07 1.9-.48 2.49-1.16"
    />
  ),
  stripe: (color) => (
    <Path
      fill={color}
      stroke="none"
      d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 23.205 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305z"
    />
  ),
};

/**
 * Shared icon set (Lucide-backed) — mirrors the web `@lockin90/ui` `Icon`.
 * Glyphs are drawn on a 24-unit viewBox with round caps/joins and a 1.9
 * stroke; color defaults to the body text token (native has no `currentColor`).
 */
export function Icon({ name, size = 18, color = colors.text }: IconProps) {
  const LucideGlyph = (LUCIDE as Partial<Record<IconName, LucideIcon>>)[name];
  if (LucideGlyph) {
    return <LucideGlyph size={size} color={color} strokeWidth={1.9} />;
  }
  const custom = (CUSTOM_GLYPHS as Partial<Record<IconName, (c: string) => ReactNode>>)[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {custom?.(color)}
    </Svg>
  );
}
