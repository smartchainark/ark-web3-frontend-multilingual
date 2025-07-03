import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  polygon,
  hardhat,
  bsc,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: '3f64ea8e00e89537aba2fe2090016cfb',
  chains: [
    bsc,
    polygon,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [hardhat] : []),
  ],
  ssr: true,
});
