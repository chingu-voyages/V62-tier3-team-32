import { FarmerProfileView } from '@/features/farmer-profile/views/farmerProfileView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sunsprig Farm | RootSource',
  description:
    'Meet Sunsprig Farm in Millbrook: fresh harvests, regenerative growing practices, and the farmer behind your food.',
};

export default function FarmerProfilePage() {
  return <FarmerProfileView />;
}
