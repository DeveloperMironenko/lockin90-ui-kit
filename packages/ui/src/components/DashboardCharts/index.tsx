'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const EnergyRing = dynamic(() => import('../EnergyRing'), { ssr: false });
const EnergyCurve = dynamic(() => import('../EnergyCurve'), { ssr: false });

interface DashboardChartsProps {
  score: number;
  curve?: number[] | null;
}

export default function DashboardCharts({ score, curve }: DashboardChartsProps) {
  const t = useTranslations('dashboardCharts');

  return (
    <div className="grid grid-cols-[280px_1fr] gap-6 mb-4">
      <div className="flex flex-col items-center justify-center gap-3">
        <div style={{ animation: 'ea-breath 3s ease-in-out infinite' }}>
          <EnergyRing score={score} size={260} animate />
        </div>
        {!score && (
          <div className="ea-mono text-muted text-center text-[10px]">
            {t('scorePending')}
          </div>
        )}
      </div>

      <div className="ea-card px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <span className="ea-eyebrow">{t('energyToday')}</span>
          <span className="ea-mono text-secondary">{t('timeRange')}</span>
        </div>
        <EnergyCurve curve={curve} height={140} animate />
        <div className="flex gap-4 mt-2.5">
          {([['#22C55E', t('zoneHigh')], ['#F59E0B', t('zoneMid')], ['#FF1F1F', t('zoneLow')]] as const).map(([c, l]) => (
            <div key={l} className="flex items-center gap-[5px]">
              <div className="w-2 h-2 rounded-sm" style={{ background: c }} />
              <span className="ea-mono text-muted text-[10px]">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
