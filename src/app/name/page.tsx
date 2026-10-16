'use client';

import dynamic from 'next/dynamic';
import { GateSkeleton } from '@/components/auth/module-gate';

// 页面主体分包：仅在 RouteGate 放行后才下载并挂载，访客不会拉取该板块的重数据
const Content = dynamic(() => import('./content'), { ssr: false, loading: () => <GateSkeleton /> });

export default function Page() {
  return <Content />;
}
