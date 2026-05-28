import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow, Mono, Caption, Body } from './index';

const meta = {
  title: 'Primitives/Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Eyebrows: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Eyebrow color="secondary">SECONDARY EYEBROW</Eyebrow>
      <Eyebrow color="accent">ACCENT EYEBROW</Eyebrow>
      <Eyebrow color="muted">MUTED EYEBROW</Eyebrow>
    </div>
  ),
};

export const MonoLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Mono color="white">12:04:33 UTC</Mono>
      <Mono color="secondary">SESSION 0xA17F</Mono>
      <Mono color="accent">429 RATE LIMITED</Mono>
      <Mono color="muted">v2.0.13</Mono>
    </div>
  ),
};

export const Captions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Caption color="muted">bpm</Caption>
      <Caption color="secondary">resting heart rate</Caption>
      <Caption color="white">today</Caption>
    </div>
  ),
};

export const Bodies: Story = {
  render: () => (
    <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Body size="base" color="white">
        Base body copy in white — the default descriptive tier under headings.
      </Body>
      <Body size="sm" color="secondary">
        Small secondary body copy for supporting context and helper text.
      </Body>
      <Body size="sm" color="muted">
        Muted small body for the least-important metadata.
      </Body>
    </div>
  ),
};
