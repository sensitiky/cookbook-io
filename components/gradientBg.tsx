import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackgroundProps } from '@/constants/interfaces';

export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  return (
    <LinearGradient colors={['#fff', '#d2f0f3']} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}
