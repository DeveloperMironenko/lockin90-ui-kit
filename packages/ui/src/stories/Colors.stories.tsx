import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = { title: 'Foundations/Colors' } satisfies Meta;
export default meta;

interface Token {
  name: string;
  val: string;
  note?: string;
}

function Swatch({ name, val, note }: Token) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ height: 54, borderRadius: 10, background: val, border: '1px solid var(--border)' }} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)' }}>{name}</div>
      {note ? <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>{note}</div> : null}
    </div>
  );
}

function Group({ title, items }: { title: string; items: Token[] }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(116px,1fr))', gap: 14 }}>
        {items.map((t) => (
          <Swatch key={t.name} {...t} />
        ))}
      </div>
    </div>
  );
}

export const Colors: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 800, color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: 26 }}>
      <Group
        title="Brand & accents"
        items={[
          { name: '--accent', val: 'var(--accent)', note: '#7C5CFF' },
          { name: '--accent-2', val: 'var(--accent-2)', note: '#22D3EE' },
          { name: '--cyan', val: 'var(--cyan)' },
          { name: '--mint', val: 'var(--mint)', note: '#34F5C5' },
          { name: '--lime', val: 'var(--lime)', note: '#A8FF35' },
        ]}
      />
      <Group
        title="Zones (status)"
        items={[
          { name: '--zone-high', val: 'var(--zone-high)', note: 'good' },
          { name: '--zone-mid', val: 'var(--zone-mid)', note: '#FFB020' },
          { name: '--zone-low', val: 'var(--zone-low)', note: '#FF4D6D' },
        ]}
      />
      <Group
        title="Text & surfaces"
        items={[
          { name: '--text', val: 'var(--text)' },
          { name: '--text-dim', val: 'var(--text-dim)' },
          { name: '--text-faint', val: 'var(--text-faint)' },
          { name: '--glass', val: 'var(--glass)' },
          { name: '--glass-2', val: 'var(--glass-2)' },
          { name: '--border', val: 'var(--border)' },
        ]}
      />
      <Group
        title="Gradients"
        items={[
          { name: '--grad-flux', val: 'var(--grad-flux)' },
          { name: '--grad-cta', val: 'var(--grad-cta)' },
          { name: '--grad-mint', val: 'var(--grad-mint)' },
          { name: '--grad-violet', val: 'var(--grad-violet)' },
        ]}
      />
    </div>
  ),
};
