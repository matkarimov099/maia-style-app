import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCash,
  IconChartBar,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ─── Mock data ───────────────────────────────────────────────

const statsCards = [
  {
    id: 'revenue',
    titleKey: 'dashboard.stats.revenue',
    value: '$2,500',
    change: 30,
    diff: '+ $355',
    diffKey: 'dashboard.stats.thanLastWeek',
    icon: IconChartBar,
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    id: 'avgOrder',
    titleKey: 'dashboard.stats.avgOrderValue',
    value: '$56.12',
    change: -30,
    diff: '- $355',
    diffKey: 'dashboard.stats.thanLastWeek',
    icon: IconShoppingCart,
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    id: 'totalOrders',
    titleKey: 'dashboard.stats.totalOrders',
    value: '2,500',
    change: 30,
    diff: '+ 355',
    diffKey: 'dashboard.stats.thanLastWeek',
    icon: IconCash,
    iconBg: 'bg-primary/10 text-primary',
  },
];

const monthlyData = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 180 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 300 },
  { name: 'May', value: 420 },
  { name: 'Jun', value: 600 },
  { name: 'Jul', value: 550 },
  { name: 'Aug', value: 700 },
  { name: 'Sep', value: 850 },
  { name: 'Oct', value: 900 },
  { name: 'Nov', value: 650 },
  { name: 'Dec', value: 500 },
];

const weeklyData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 250 },
  { name: 'Thu', value: 400 },
  { name: 'Fri', value: 350 },
  { name: 'Sat', value: 500 },
  { name: 'Sun', value: 200 },
];

// ─── Components ──────────────────────────────────────────────

function StatCard({
  titleKey,
  value,
  change,
  diff,
  diffKey,
  icon: Icon,
  iconBg,
}: (typeof statsCards)[number]) {
  const { t } = useTranslation();
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium text-sm',
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            )}
          >
            {isPositive ? (
              <IconArrowUpRight className="h-4 w-4" />
            ) : (
              <IconArrowDownRight className="h-4 w-4" />
            )}
            {Math.abs(change)}%
          </span>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">{t(titleKey)}</p>
          <p className="mt-1 font-bold text-2xl tracking-tight">{value}</p>
        </div>

        <p className="text-muted-foreground text-xs">
          <span
            className={
              isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }
          >
            {diff}
          </span>{' '}
          {t(diffKey)}
        </p>
      </CardContent>
    </Card>
  );
}

function SalesCard() {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="flex flex-col gap-4">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'
          )}
        >
          <IconCash className="h-5 w-5" />
        </div>

        <div>
          <p className="font-semibold text-base">{t('dashboard.stats.totalSalesCost')}</p>
          <p className="text-muted-foreground text-sm">{t('dashboard.stats.last28Days')}</p>
        </div>

        <div className="flex items-end gap-3">
          <p className="font-bold text-3xl tracking-tight">$2,500</p>
          <span className="mb-1 inline-flex items-center gap-0.5 rounded-lg bg-green-100 px-2 py-0.5 font-medium text-green-700 text-xs dark:bg-green-500/20 dark:text-green-400">
            <IconArrowUpRight className="h-3.5 w-3.5" />
            30%
          </span>
        </div>

        <p className="text-muted-foreground text-xs">
          <span className="text-green-600 dark:text-green-400">+1,500</span>{' '}
          {t('dashboard.stats.vsPrev28Days')}
        </p>
      </CardContent>
    </Card>
  );
}

function TransactionsChart() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const data = period === 'month' ? monthlyData : weeklyData;

  return (
    <Card>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-base">{t('dashboard.charts.transactionsActivity')}</p>
          <div className="flex items-center rounded-lg bg-muted p-0.5">
            <button
              type="button"
              onClick={() => setPeriod('week')}
              className={cn(
                'rounded-md px-3 py-1 font-medium text-xs transition-colors',
                period === 'week'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('dashboard.charts.week')}
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={cn(
                'rounded-md px-3 py-1 font-medium text-xs transition-colors',
                period === 'month'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('dashboard.charts.month')}
            </button>
          </div>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={period === 'month' ? 24 : 32}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                  borderRadius: '0.75rem',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--card))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '0.875rem',
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} className="fill-primary/70" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map(card => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Sales + Chart row */}
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <SalesCard />
        <TransactionsChart />
      </div>
    </div>
  );
}
