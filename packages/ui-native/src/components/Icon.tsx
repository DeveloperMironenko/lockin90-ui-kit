import { type ReactNode } from 'react';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';
import {
  ArrowDownWideNarrow,
  ArrowRight,
  Bell,
  Bike,
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
  Dumbbell,
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
  Footprints,
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
  Laptop,
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
  Monitor,
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
  Smartphone,
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
  Volleyball,
  Waves,
  Weight,
  Wrench,
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
  // devices / tools (account sub-pages: security sessions · changelog groups)
  | 'wrench'
  | 'monitor'
  | 'smartphone'
  | 'laptop'
  // session
  | 'logout'
  // training · activity glyphs (kit-reused Lucide, Aurora activity-icons board)
  | 'dumbbell'
  | 'footprints'
  | 'bike'
  | 'waves'
  | 'zap'
  | 'ball'
  // training · custom Aurora activity glyphs (no clean Lucide match)
  | 'activity-mobility'
  | 'activity-rowing'
  | 'activity-yoga'
  | 'activity-pilates'
  | 'activity-stretching'
  | 'activity-foam-roll'
  | 'activity-sauna'
  | 'activity-cold-plunge';

export interface IconProps {
  name: IconName;
  /** pixel size of the rendered glyph (width = height) @default 18 */
  size?: number;
  /**
   * Non-square rendering for WIDE glyphs (the vendored brand WORDMARKS —
   * whoop/oura/garmin/polar span the full 24-box width at ~4-7 units tall).
   * When set, `width`×`height` replace the square `size` box; the 24-unit
   * viewBox scales to fit. E.g. a readable wordmark row slot: width 72, height 16.
   */
  width?: number;
  height?: number;
  /**
   * Glyph color. Native has no `currentColor` inheritance, so this stands in
   * for the web's parent-driven `currentColor`. @default colors.text
   */
  color?: string;
}

/**
 * Names that stay custom (non-Lucide): brand marks Lucide doesn't ship —
 * vendored real logo paths where a clean vector exists, hand-drawn otherwise —
 * and the bespoke 5-step mood scale (its two frown depths / two smile depths
 * have no distinct Lucide equivalents).
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
  | 'stripe'
  | 'activity-mobility'
  | 'activity-rowing'
  | 'activity-yoga'
  | 'activity-pilates'
  | 'activity-stretching'
  | 'activity-foam-roll'
  | 'activity-sauna'
  | 'activity-cold-plunge';

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
  // devices / tools
  wrench: Wrench,
  monitor: Monitor,
  smartphone: Smartphone,
  laptop: Laptop,
  // session
  logout: LogOut,
  // training · activity glyphs (kit-reused — see the Aurora activity-icons board)
  dumbbell: Dumbbell,
  footprints: Footprints,
  bike: Bike,
  waves: Waves,
  zap: Zap,
  ball: Volleyball,
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

  // ── provider / brand marks (real logo paths, monochrome fills) ───────────
  // Vendored sources:
  //   oura   — official ŌURA wordmark vector (PD textlogo), rescaled to the 24-box
  //   whoop  — Wikimedia Commons "WHOOP_Logo_Black.svg" (PD textlogo), ® dropped, rescaled
  //   polar  — Wikimedia Commons "Polar_Electro_Logo.svg" (PD textlogo), ® dropped, rescaled
  //   garmin — simple-icons v16.25.0 `garmin` (MIT), verbatim 24×24
  //   strava — simple-icons v16.25.0 `strava` (MIT), inset ×0.85 about center for optical balance
  //   apple-health — hand-drawn Health-app heart (no vendorable mark)
  //   dexcom — hand-drawn silhouette (no vendorable mark)
  oura: (color) => (
    <Path
      fill={color}
      stroke="none"
      fillRule="evenodd"
      d="M1.535 8.93h3.07V8.267H1.535zM15.565 12.478h-2.148V10.277h2.148c0.765 0 1.279 0.442 1.279 1.1s-0.514 1.101-1.279 1.101m0.711 0.515c0.737-0.21 1.213-0.844 1.213-1.616 0-1.001-0.773-1.674-1.924-1.674H12.772v5.918h0.645V13.061h2.184l1.391 2.56h0.698l-1.451-2.617z m-6.85 2.74c1.581 0 2.685-1.11 2.684-2.7V9.703h-0.662v3.285c0 1.226-0.832 2.082-2.022 2.082-0.987 0-2.049-0.652-2.049-2.082V9.703h-0.663v3.33c0 1.59 1.115 2.7 2.712 2.7M20.993 10.475l1.397 3.056H19.587L20.993 10.475Zm-0.311-0.771L17.976 15.622h0.692l0.669-1.517h3.302l0.669 1.517h0.692L21.294 9.704z m-17.611-0.112C1.377 9.592 0 10.969 0 12.662s1.377 3.071 3.071 3.071 3.071-1.377 3.07-3.071S4.764 9.592 3.071 9.592m0 5.479c-1.328 0-2.408-1.08-2.408-2.408s1.08-2.408 2.408-2.408 2.408 1.08 2.408 2.408-1.08 2.408-2.408 2.408"
    />
  ),
  whoop: (color) => (
    <Path
      fill={color}
      stroke="none"
      fillRule="evenodd"
      d="M12.868 10.028C12.335 10.02 11.82 10.223 11.437 10.593 11.054 10.964 10.833 11.471 10.824 12.004 10.847 12.531 11.073 13.028 11.454 13.392 11.834 13.757 12.341 13.96 12.868 13.96 13.395 13.96 13.902 13.757 14.282 13.392 14.663 13.028 14.889 12.531 14.912 12.004 14.902 11.472 14.681 10.964 14.298 10.594 13.915 10.224 13.401 10.02 12.868 10.028ZM12.868 13.514C12.461 13.521 12.068 13.365 11.775 13.082 11.482 12.799 11.313 12.412 11.306 12.004 11.306 11.59 11.471 11.193 11.763 10.9 12.056 10.607 12.454 10.442 12.868 10.442 13.282 10.442 13.68 10.607 13.972 10.9 14.265 11.193 14.43 11.59 14.43 12.004 14.423 12.412 14.254 12.799 13.961 13.082 13.668 13.365 13.275 13.521 12.868 13.514ZM6.4 10.028H6.898V13.98H6.4V10.028ZM7.4 11.764H8.834V12.246H7.4V11.764ZM9.834 10.028H9.336V13.98H9.834V10.028ZM20.93 10.028H21.43V13.98H20.93V10.028ZM21.93 10.028H22.6C22.78 10.025 22.96 10.057 23.128 10.123 23.296 10.189 23.449 10.287 23.579 10.412 23.709 10.537 23.813 10.687 23.885 10.852 23.958 11.018 23.997 11.196 24 11.376 23.997 11.557 23.958 11.735 23.885 11.9 23.813 12.066 23.709 12.215 23.579 12.34 23.449 12.465 23.296 12.564 23.128 12.63 22.96 12.696 22.78 12.728 22.6 12.724H21.932V12.256H22.6C22.837 12.26 23.066 12.169 23.237 12.004 23.408 11.84 23.506 11.614 23.51 11.376 23.505 11.139 23.407 10.914 23.236 10.749 23.066 10.585 22.837 10.495 22.6 10.498H21.932L21.93 10.028ZM15.788 12.004C15.811 11.478 16.037 10.981 16.418 10.616 16.798 10.252 17.305 10.049 17.832 10.049 18.359 10.049 18.866 10.252 19.246 10.616 19.627 10.981 19.853 11.478 19.876 12.004 19.853 12.531 19.627 13.028 19.246 13.392 18.866 13.757 18.359 13.96 17.832 13.96 17.305 13.96 16.798 13.757 16.418 13.392 16.037 13.028 15.811 12.531 15.788 12.004ZM16.27 12.004C16.27 12.419 16.435 12.817 16.728 13.111 17.022 13.404 17.42 13.569 17.835 13.569 18.25 13.569 18.648 13.404 18.942 13.111 19.235 12.817 19.4 12.419 19.4 12.004 19.4 11.59 19.235 11.193 18.943 10.9 18.65 10.607 18.252 10.442 17.838 10.442 17.424 10.442 17.026 10.607 16.734 10.9 16.441 11.193 16.276 11.59 16.276 12.004H16.27ZM2.958 11.522L3.732 13.98H4.216L5.46 10.028H4.976L3.976 13.21 3.442 11.522H2.958ZM0 10.028L0.774 12.486H1.258L0.484 10.028H0ZM1.244 13.98L2.488 10.028H2.972L1.728 13.98H1.244Z"
    />
  ),
  garmin: (color) => (
    <Path
      fill={color}
      stroke="none"
      d="M6.265 12.024a.289.289 0 0 0-.236-.146h-.182a.289.289 0 0 0-.234.146l-1.449 3.025c-.041.079.004.138.094.138h.335c.132 0 .193-.061.228-.134.037-.073.116-.234.13-.266.02-.045.083-.071.175-.071h1.559c.089 0 .148.016.175.071.018.035.098.179.136.256a.24.24 0 0 0 .234.142h.486c.089 0 .13-.069.098-.132-.034-.061-1.549-3.029-1.549-3.029zm-.914 2.224c-.089 0-.132-.067-.094-.148l.571-1.222c.039-.081.1-.081.136 0l.555 1.222c.037.081-.006.148-.096.148H5.351zm12.105-2.201v3.001c0 .083.073.138.163.138h.396c.089 0 .163-.057.163-.146v-2.998c0-.089-.059-.163-.148-.163h-.411c-.09-.001-.163.054-.163.168zm-6.631 1.88c-.051-.073-.022-.154.063-.181 0 0 .342-.102.506-.25.165-.146.246-.36.246-.636a1 1 0 0 0-.096-.457.787.787 0 0 0-.27-.303 1.276 1.276 0 0 0-.423-.171c-.165-.035-.386-.047-.386-.047a8.81 8.81 0 0 0-.325-.008H8.495a.164.164 0 0 0-.163.163v2.998c0 .089.073.146.163.146h.388c.089 0 .163-.057.163-.146v-1.193s.002 0 .002-.002l.738-.002c.089 0 .205.061.258.134l.766 1.077c.071.096.138.132.228.132h.508c.089 0 .104-.085.073-.128-.032-.038-.794-1.126-.794-1.126zm-.311-.61a1.57 1.57 0 0 1-.213.028 8.807 8.807 0 0 1-.325.006h-.763a.164.164 0 0 1-.163-.163v-.608c0-.089.073-.163.163-.163h.762c.089 0 .236.004.325.006 0 0 .114.004.213.028a.629.629 0 0 1 .24.098.358.358 0 0 1 .126.148.473.473 0 0 1 0 .374.352.352 0 0 1-.126.148.617.617 0 0 1-.239.098zm11.803-1.439c-.089 0-.163.059-.163.146v1.919c0 .089-.051.11-.114.047l-1.921-1.992a.376.376 0 0 0-.276-.118h-.362c-.114 0-.163.061-.163.122v3.068c0 .061.059.12.148.12h.362c.089 0 .152-.049.152-.132l.002-2.021c0-.089.051-.11.114-.045l2.004 2.082a.36.36 0 0 0 .279.116h.272a.164.164 0 0 0 .163-.163v-2.986a.164.164 0 0 0-.163-.163h-.334zm-7.835 1.87c-.043.079-.116.077-.159 0l-.939-1.724a.262.262 0 0 0-.236-.146h-.51a.164.164 0 0 0-.163.163v2.996c0 .089.059.15.163.15h.317c.089 0 .154-.057.154-.142 0-.041.002-2.179.004-2.179.004 0 1.173 2.177 1.173 2.177a.105.105 0 0 0 .189 0s1.179-2.173 1.181-2.173c.004 0 .002 2.11.002 2.173 0 .087.069.142.159.142h.364c.089 0 .163-.045.163-.163V12.04a.164.164 0 0 0-.163-.163h-.488a.265.265 0 0 0-.244.142l-.967 1.729zM0 13.529c0 1.616 1.653 1.697 1.984 1.697 1.098 0 1.561-.297 1.58-.309a.29.29 0 0 0 .152-.264v-1.116a.186.186 0 0 0-.187-.187H2.151c-.104 0-.171.083-.171.187v.116c0 .104.067.187.171.187h.797a.14.14 0 0 1 .14.14v.52c-.157.065-.874.274-1.451.136-.836-.199-.901-.89-.901-1.096 0-.173.053-1.043 1.079-1.13.831-.071 1.378.264 1.384.268.098.051.199.014.254-.089l.104-.209c.043-.085.028-.175-.077-.246-.006-.004-.59-.319-1.494-.319C.055 11.813 0 13.354 0 13.529zm22.134-2.478h-2.165c-.079 0-.148-.039-.187-.108s-.039-.146 0-.215l1.084-1.874a.21.21 0 0 1 .187-.108.21.21 0 0 1 .187.108l1.084 1.874a.203.203 0 0 1 0 .215.22.22 0 0 1-.19.108zm1.488 3.447c.207 0 .378.169.378.378a.379.379 0 0 1-.378.378.379.379 0 0 1-.378-.378.38.38 0 0 1 .378-.378zm.002.7c.173 0 .305-.14.305-.321s-.13-.321-.305-.321-.307.14-.307.321c0 .18.13.321.307.321zm-.146-.543h.169c.102 0 .152.041.152.124 0 .071-.045.122-.114.122l.126.195h-.077l-.124-.195h-.061v.195h-.073v-.441h.002zm.073.189h.085c.055 0 .091-.012.091-.069 0-.051-.045-.065-.091-.065h-.085v.134z"
    />
  ),
  polar: (color) => (
    <Path
      fill={color}
      stroke="none"
      fillRule="evenodd"
      d="M9.562 11.705c0.096 1.232-0.915 2.318-2.139 2.355-1.294 0.04-2.231-1.09-1.976-2.355h4.115m-0.129-0.564C9.131 10.365 8.382 9.9 7.562 9.921c-0.81 0.021-1.549 0.505-1.916 1.22h3.787M1.301 11.705h2.211c0.153 0 0.285-0.124 0.3-0.277 0.015-0.159-0.105-0.287-0.265-0.287H0.9l0.336-0.978c0.029-0.083 0.109-0.143 0.199-0.143h2.33c0.793 0 1.389 0.653 1.316 1.443-0.07 0.757-0.73 1.358-1.489 1.359l-1.456 0c-0.135 0-0.252 0.085-0.293 0.206L1.578 13.798c-0.029 0.084-0.109 0.143-0.198 0.143H0.307c-0.19 0-0.307-0.181-0.246-0.359l0.45-1.308c0.115-0.334 0.434-0.569 0.79-0.569m20.523 2.236l-0.248-0.928c-0.031-0.117-0.13-0.191-0.25-0.191l-0.344 0c-0.135 0-0.252 0.085-0.294 0.206l-0.264 0.77c-0.029 0.084-0.109 0.143-0.198 0.143h-1.073c-0.19 0-0.307-0.181-0.246-0.359l0.449-1.308c0.115-0.334 0.434-0.569 0.79-0.569h2.212c0.153 0 0.286-0.124 0.299-0.277 0.015-0.159-0.105-0.287-0.264-0.287H19.746l0.336-0.978c0.029-0.083 0.109-0.143 0.198-0.143h2.331c0.793 0 1.389 0.653 1.316 1.443-0.049 0.534-0.392 0.99-0.856 1.213l0.338 1.265H21.824M12.091 11.141l0.299-0.872c0.042-0.124-0.04-0.249-0.173-0.249h-1.176c-0.089 0-0.17 0.059-0.199 0.143l-0.336 0.978h1.585m0.978 2.8h-3.156c-0.19 0-0.307-0.181-0.246-0.359l0.645-1.877h1.585l-0.221 0.643c-0.061 0.178 0.059 0.358 0.248 0.358h1.345c0.19 0 0.311 0.18 0.25 0.358l-0.252 0.734c-0.029 0.084-0.109 0.143-0.198 0.143M16.714 10.095l-0.872 1.046h2.348l-0.088-0.957c-0.009-0.096-0.088-0.164-0.184-0.164h-1.044c-0.062 0-0.121 0.028-0.16 0.075m0.317 3.846h1.187c0.119 0 0.219-0.109 0.209-0.229l-0.185-2.007h-2.87l-1.485 1.781c-0.15 0.181-0.045 0.455 0.197 0.455h0.943c0.062 0 0.121-0.031 0.16-0.078l0.78-0.935c0.057-0.068 0.142-0.106 0.231-0.106h0.318c0.138 0 0.252 0.096 0.265 0.235l0.066 0.716a0.183 0.183 0 0 0 0.184 0.168"
    />
  ),
  'apple-health': (color) => (
    <Path
      fill={color}
      stroke="none"
      d="M12 20.9c-.32 0-.63-.11-.88-.32C6.72 16.87 2.7 13.4 2.7 9.42 2.7 6.17 5.24 3.7 8.42 3.7c1.48 0 2.75.62 3.58 1.68C12.83 4.32 14.1 3.7 15.58 3.7c3.18 0 5.72 2.47 5.72 5.72 0 3.98-4.02 7.45-8.42 11.16-.25.21-.56.32-.88.32Z"
    />
  ),
  dexcom: () => (
    <Path d="M12 3.5C12 3.5 5 11 5 15a7 7 0 0 0 14 0c0-4-7-11.5-7-11.5z" />
  ),
  strava: (color) => (
    <Path
      fill={color}
      stroke="none"
      d="M14.879 17.052l-1.776-3.498h-2.605L14.879 22.2l4.377-8.646h-2.606m-5.956-4.759l2.41 4.758h3.546L10.694 1.8l-5.95 11.754h3.543"
    />
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

  // ── training · custom Aurora activity glyphs (Aurora activity-icons board) ──
  // Hand-drawn line glyphs for activities Lucide has no clean match for.
  // Stroke pinned to 1.85 (the board's spec) via an explicit strokeWidth on
  // each primitive — overriding the shared custom-glyph Svg's 1.9 default.
  'activity-mobility': () => (
    <>
      <Circle cx="12" cy="4.5" r="1.8" strokeWidth={1.85} />
      <Path d="M12 8v5M6 21l3-5 3-3 3 3 3 5M8.5 12.5h7" strokeWidth={1.85} />
    </>
  ),
  // Was an accidental duplicate of the swimming glyph (same wavy-water path) —
  // redrawn as the oar stroke from the activity-icons board (`custom · oar`):
  // a handle/feathering path + the diagonal oar shaft + blade + tip.
  'activity-rowing': () => (
    <Path
      d="M4 19c1.6 0 1.6 1.2 3.2 1.2S9 19 10.5 19M4.5 5l11 11M14 5l-2.2.6.7 2.4M15.5 16.5 20 12"
      strokeWidth={1.85}
    />
  ),
  'activity-yoga': () => (
    <>
      <Circle cx="12" cy="4.5" r="1.8" strokeWidth={1.85} />
      <Path d="M12 8v4M12 12c-3.5 0-6.5 1.5-6.5 4M12 12c3.5 0 6.5 1.5 6.5 4M8 15.5h8" strokeWidth={1.85} />
    </>
  ),
  'activity-pilates': () => (
    <>
      <Circle cx="12" cy="4.5" r="1.8" strokeWidth={1.85} />
      <Path d="M8 9l4 2 4-2M12 11v4M9 20l3-5 3 5" strokeWidth={1.85} />
    </>
  ),
  // dedicated "reach" glyph — was silently sharing `activity-mobility`'s
  // generic stretch pose (activity-icons board `custom · reach`).
  'activity-stretching': () => (
    <>
      <Circle cx="7" cy="5" r="1.7" strokeWidth={1.85} />
      <Path d="M7 7v4l5 2M12 13l6-1M18 12l-1.5-2M18 12l.5-2.4" strokeWidth={1.85} />
    </>
  ),
  'activity-foam-roll': () => (
    <>
      <Rect x="3" y="9" width="18" height="6" rx="3" strokeWidth={1.85} />
      <Path d="M8 9v6M12 9v6M16 9v6" strokeWidth={1.85} />
    </>
  ),
  'activity-sauna': () => (
    <Path
      d="M4 20h16M6 20v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4M9 9.5c0-1.6 1-2.2 1-3.2M13 9.5c0-1.6 1-2.2 1-3.2M17 9.5c0-1.6 1-2.2 1-3.2"
      strokeWidth={1.85}
    />
  ),
  'activity-cold-plunge': () => (
    <Path
      d="M12 3v18M4.2 7.5 19.8 16.5M19.8 7.5 4.2 16.5M12 6.5l2.6-1.6M12 6.5 9.4 4.9M12 17.5l2.6 1.6M12 17.5l-2.6 1.6M4.6 12H8M16 12h3.4"
      strokeWidth={1.85}
    />
  ),
};

/**
 * Shared icon set (Lucide-backed) — mirrors the web `@lockin90/ui` `Icon`.
 * Glyphs are drawn on a 24-unit viewBox with round caps/joins and a 1.9
 * stroke; color defaults to the body text token (native has no `currentColor`).
 */
/** Official brand ink for the vendored provider marks, adapted for the dark UI
 *  (brands whose primary mark is black render white here — the standard
 *  dark-surface treatment; colored brands keep their real hex). */
export const BRAND_COLORS: Partial<Record<IconName, string>> = {
  whoop: '#FFFFFF',
  oura: '#FFFFFF',
  garmin: '#FFFFFF',
  polar: '#D10027',
  strava: '#FC4C02',
  'apple-health': '#FF2D55',
  dexcom: '#58A618',
  google: '#FFFFFF',
  apple: '#FFFFFF',
};

/** Vertical bounds of the vendored WORDMARK glyphs inside the 24-box (measured
 *  at vendor time) — lets non-square rendering crop to the mark's own band so a
 *  `width`×`height` box is filled edge-to-edge instead of letterboxed. */
const WORDMARK_BAND: Partial<Record<IconName, { y: number; h: number }>> = {
  whoop: { y: 9.4, h: 5.2 },
  oura: { y: 7.7, h: 8.7 },
  garmin: { y: 8.1, h: 7.7 },
  polar: { y: 9.3, h: 5.4 },
};

export function Icon({ name, size = 18, width, height, color = colors.text }: IconProps) {
  const LucideGlyph = (LUCIDE as Partial<Record<IconName, LucideIcon>>)[name];
  if (LucideGlyph) {
    return <LucideGlyph size={size} color={color} strokeWidth={1.9} />;
  }
  const custom = (CUSTOM_GLYPHS as Partial<Record<IconName, (c: string) => ReactNode>>)[name];
  const band = width != null || height != null ? WORDMARK_BAND[name] : undefined;
  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox={band ? `0 ${band.y} 24 ${band.h}` : '0 0 24 24'}
      preserveAspectRatio={band ? 'xMinYMid meet' : 'xMidYMid meet'}
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
