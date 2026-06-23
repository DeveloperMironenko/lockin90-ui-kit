import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { MessageBubble } from '../components/MessageBubble';

const meta = { title: 'Native/MessageBubble' } satisfies Meta;
export default meta;

type Story = StoryObj;

const wrap = { gap: 12, width: 380, padding: 16, backgroundColor: '#0C0F1A', borderRadius: 18 } as const;

export const Incoming: Story = {
  render: () => (
    <View style={wrap}>
      <MessageBubble variant="incoming" meta="Sofia · 8:02am">
        Saw your HRV jump to 68 ms this morning, nice. How did the 4×3 squats feel yesterday?
      </MessageBubble>
    </View>
  ),
};

export const Outgoing: Story = {
  render: () => (
    <View style={wrap}>
      <MessageBubble variant="outgoing" status="read" meta="9:31am">
        Bar speed was crisp at 85%. Last set felt like RPE 8, not 8.5 — could&apos;ve added a rep.
      </MessageBubble>
    </View>
  ),
};

/** A thread — alternating bubbles with meta lines + a read receipt. */
export const Thread: Story = {
  render: () => (
    <View style={wrap}>
      <MessageBubble variant="incoming" meta="Sofia · 9:14am">
        Pushed Plan v3 — moved your heavy squat to the 9:30am window.
      </MessageBubble>
      <MessageBubble variant="outgoing" status="read" meta="9:15am">
        Got it, syncing now. Lights out by 10:45 tonight to protect the window.
      </MessageBubble>
      <MessageBubble variant="incoming" meta="Sofia · 9:48am">
        Perfect — exactly where we want peaking week. Watch the late caffeine though.
      </MessageBubble>
      <MessageBubble variant="outgoing" status="delivered" meta="9:50am">
        Cutting it after 1pm. Thanks coach.
      </MessageBubble>
      <MessageBubble variant="outgoing" status="sent" meta="9:51am">
        Sending the session log now.
      </MessageBubble>
    </View>
  ),
};
