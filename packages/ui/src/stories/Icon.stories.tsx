import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconName } from '../components/Icon';

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  args: { name: 'share', size: 24 },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Icon>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

const ALL: IconName[] = [
  // core
  'back',
  'chevron',
  'chevronLeft',
  'share',
  'more',
  'lock',
  'play',
  'info',
  'timer',
  'plus',
  'check',
  'star',
  // content / block types
  'image',
  'text',
  'heading',
  'quote',
  'embed',
  'code',
  'grid',
  'table',
  'columns',
  'list',
  'listOrdered',
  // text formatting
  'bold',
  'italic',
  'link',
  'unlink',
  'externalLink',
  // files / media
  'file',
  'fileText',
  'video',
  'folder',
  'folderOpen',
  // editor actions
  'grip',
  'eye',
  'eyeOff',
  'copy',
  'duplicate',
  'trash',
  'edit',
  'save',
  'translate',
  'settings',
  'search',
  'close',
  // data / lists
  'calendar',
  'filter',
  'sort',
  'upload',
  'download',
  // status / feedback
  'sparkle',
  'warning',
  'checkCircle',
  'xCircle',
  'refresh',
  // navigation
  'chevronDown',
  'chevronUp',
  'bell',
  'user',
  // misc
  'palette',
  'crop',
  // mood faces (escalating)
  'mood-rough',
  'mood-low',
  'mood-ok',
  'mood-good',
  'mood-great',
  // provider / brand marks
  'oura',
  'whoop',
  'garmin',
  'polar',
  'apple-health',
  'dexcom',
  'strava',
  // bottom-nav
  'home',
  'activity',
  // nav / domain / brand
  'energy',
  'sleep',
  'insights',
  'billing',
  'globe',
  'heart',
  'flame',
  'height',
  'weight',
  'arrow-right',
  'shield',
  'google',
  'apple',
  'stripe',
  // mobile domain
  'mail',
  'caffeine',
  'meal',
  'mood',
  'scale',
  'ruler',
  'card',
  'data-source',
  // consumer screens
  'send',
  'attach',
  'emoji',
  'mic',
  'comment',
  'bookmark',
  'target',
  'medal',
  'drop',
  'utensil',
  'barcode-scan',
  'pill',
  'flask',
  'syringe',
  'camera',
  // session
  'logout',
];

export const AllIcons: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--text)' }}>
      {ALL.map((name) => (
        <Icon key={name} name={name} size={24} />
      ))}
    </div>
  ),
};
