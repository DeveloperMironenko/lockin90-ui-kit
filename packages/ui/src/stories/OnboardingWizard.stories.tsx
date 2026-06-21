import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnboardingWizard } from '../components/OnboardingWizard';

const meta = {
  title: 'Components/OnboardingWizard',
  component: OnboardingWizard,
} satisfies Meta<typeof OnboardingWizard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
