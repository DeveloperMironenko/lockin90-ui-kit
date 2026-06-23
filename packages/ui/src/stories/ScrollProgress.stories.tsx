import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollProgress } from '../components/ScrollProgress';

const meta = {
  title: 'Primitives/ScrollProgress',
  component: ScrollProgress,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScrollProgress>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Tall scrollable filler so the page actually has somewhere to scroll. */
function TallContent() {
  return (
    <div style={{ padding: '40px 32px 200vh', maxWidth: 720, margin: '0 auto', color: 'var(--text)' }}>
      <h2 style={{ marginTop: 24 }}>Scroll the page</h2>
      <p style={{ color: 'var(--text-dim)' }}>
        The bar pinned to the very top fills left-to-right as you scroll this article toward the
        bottom. It tracks the window by default.
      </p>
      {Array.from({ length: 16 }).map((_, i) => (
        <p key={i} style={{ color: 'var(--text-dim)', lineHeight: 1.7 }}>
          Section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      ))}
    </div>
  );
}

export const Default: Story = {
  args: { gradient: 'cta', height: 3 },
  render: (args) => (
    <>
      <ScrollProgress {...args} />
      <TallContent />
    </>
  ),
};

export const Flux: Story = {
  args: { gradient: 'flux', height: 4 },
  render: (args) => (
    <>
      <ScrollProgress {...args} />
      <TallContent />
    </>
  ),
};

export const Mint: Story = {
  args: { gradient: 'mint', height: 3 },
  render: (args) => (
    <>
      <ScrollProgress {...args} />
      <TallContent />
    </>
  ),
};

export const Violet: Story = {
  args: { gradient: 'violet', height: 5 },
  render: (args) => (
    <>
      <ScrollProgress {...args} />
      <TallContent />
    </>
  ),
};
