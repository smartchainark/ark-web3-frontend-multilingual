import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  polygon,
  hardhat,
  bsc,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    bsc,
    polygon,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [hardhat] : []),
  ],
  ssr: true,
});
