'use client'

import React, { useState } from 'react'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { StatCard } from '@/components/publisher/stat-card'
import { MetricChart } from '@/components/publisher/chart'
import { DataTable, Column } from '@/components/publisher/data-table'
import { StatusBadge } from '@/components/publisher/status-badge'
import { Button } from '@/components/ui/button'
import {
  MoneyBagIcon,
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
} from '@/components/icons'

interface ApiRevenueItem {
  id: string
  apiName: string
  subscribers: number
  grossRevenue: string
  platformFee: string
  netEarnings: string
}

interface PayoutRecord {
  id: string
  payoutDate: string
  amount: string
  bankDestination: string
  status: 'ACTIVE' | 'DRAFT' | 'MAINTENANCE' | 'DEPRECATED'
  reference: string
}

const API_REVENUE_DATA: ApiRevenueItem[] = [
  {
    id: '1',
    apiName: 'Neural Embeddings Engine',
    subscribers: 642,
    grossRevenue: '$15,866.67',
    platformFee: '$1,586.67',
    netEarnings: '$14,280.00',
  },
  {
    id: '2',
    apiName: 'Financial Ledger Consensus',
    subscribers: 318,
    grossRevenue: '$7,611.11',
    platformFee: '$761.11',
    netEarnings: '$6,850.00',
  },
  {
    id: '3',
    apiName: 'Geolocation Geofencing',
    subscribers: 460,
    grossRevenue: '$2,377.78',
    platformFee: '$237.78',
    netEarnings: '$2,140.00',
  },
  {
    id: '4',
    apiName: 'Biometric Face Verification',
    subscribers: 120,
    grossRevenue: '$1,755.56',
    platformFee: '$175.56',
    netEarnings: '$1,580.00',
  },
]

const PAYOUT_HISTORY: PayoutRecord[] = [
  {
    id: 'po_9918237',
    payoutDate: 'OCT 01, 2026',
    amount: '$18,450.00',
    bankDestination: 'JPMorgan Chase (••••4892)',
    status: 'ACTIVE',
    reference: 'STRIPE_ACH_991823',
  },
  {
    id: 'po_9827411',
    payoutDate: 'SEP 01, 2026',
    amount: '$14,210.00',
    bankDestination: 'JPMorgan Chase (••••4892)',
    status: 'ACTIVE',
    reference: 'STRIPE_ACH_982741',
  },
  {
    id: 'po_9736190',
    payoutDate: 'AUG 01, 2026',
    amount: '$11,940.00',
    bankDestination: 'JPMorgan Chase (••••4892)',
    status: 'ACTIVE',
    reference: 'STRIPE_ACH_973619',
  },
]

const REVENUE_TREND_DATA = [
  { label: 'SEP 07', value: 680 },
  { label: 'SEP 14', value: 740 },
  { label: 'SEP 21', value: 890 },
  { label: 'SEP 28', value: 920 },
  { label: 'OCT 05', value: 1040 },
]

export default function PublisherRevenuePage() {
  const apiRevColumns: Column<ApiRevenueItem>[] = [
    {
      key: 'apiName',
      header: 'SERVICE / API',
      render: (item) => (
        <span className="font-bold text-black group-hover:text-white block tracking-tight">
          {item.apiName}
        </span>
      ),
    },
    {
      key: 'subscribers',
      header: 'SUBSCRIBERS',
      render: (item) => (
        <span className="font-mono text-xs">{item.subscribers}</span>
      ),
    },
    {
      key: 'grossRevenue',
      header: 'GROSS VOLUME',
      render: (item) => (
        <span className="font-mono text-xs text-[#525252] group-hover:text-white">
          {item.grossRevenue}
        </span>
      ),
    },
    {
      key: 'platformFee',
      header: 'EPHEMERAL (10%)',
      render: (item) => (
        <span className="font-mono text-xs text-[#525252] group-hover:text-white">
          {item.platformFee}
        </span>
      ),
    },
    {
      key: 'netEarnings',
      header: 'NET EARNINGS',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <span className="font-mono text-xs font-bold tracking-tight">
          {item.netEarnings}
        </span>
      ),
    },
  ]

  const payoutColumns: Column<PayoutRecord>[] = [
    {
      key: 'id',
      header: 'PAYOUT ID',
      render: (item) => (
        <span className="font-mono text-xs font-bold text-black group-hover:text-white">
          {item.id}
        </span>
      ),
    },
    {
      key: 'payoutDate',
      header: 'SETTLED DATE',
      render: (item) => (
        <span className="font-mono text-xs text-[#525252] group-hover:text-white">
          {item.payoutDate}
        </span>
      ),
    },
    {
      key: 'bankDestination',
      header: 'DESTINATION ACCOUNT',
      render: (item) => (
        <span className="font-mono text-xs">{item.bankDestination}</span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: () => <StatusBadge status="ACTIVE" />,
    },
    {
      key: 'amount',
      header: 'AMOUNT (USD)',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <span className="font-mono text-xs font-bold tracking-tight">
          {item.amount}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="FINANCIAL LEDGER // ESCROW, BALANCES & SETTLEMENTS"
          title="Revenue."
          subtitle="Monetization earnings, Stripe Connect payout cycles, and platform revenue splits."
          className="pb-0"
        />

        <a
          href="https://dashboard.stripe.com/express"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" className="flex items-center gap-2">
            <span>STRIPE EXPRESS</span>
            <ArrowUpRight01Icon size={14} />
          </Button>
        </a>
      </div>

      {/* Inverted Hero Financial Stats */}
      <section className="bg-black text-white p-8 border-2 border-black texture-inverted-lines">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            label="AVAILABLE FOR PAYOUT"
            value="$18,450.00"
            subtext="AUTO-DISBURSED OCT 08"
            inverted
          />
          <StatCard
            label="ESCROW BALANCE"
            value="$6,400.00"
            subtext="PENDING MONTHLY RECONCILIATION"
            inverted
          />
          <StatCard
            label="30D NET VOLUME"
            value="$24,850.00"
            subtext="+18.4% OVER LAST MONTH"
            inverted
          />
          <StatCard
            label="EPHEMERAL FEE"
            value="10.0%"
            subtext="NO HIDDEN TRANSACTION FEES"
            inverted
          />
        </div>
      </section>

      {/* Stripe Connect Escrow Status Banner */}
      <div className="border border-black p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 border border-black bg-black text-white">
            <CheckmarkCircle02Icon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-black">
                STRIPE CONNECT CUSTOM ACCOUNT
              </span>
              <span className="w-1.5 h-1.5 bg-black inline-block" />
              <span className="font-mono text-[10px] text-[#525252] uppercase">
                acct_1NZephemeral99x
              </span>
            </div>
            <p className="font-serif text-sm text-[#525252] mt-0.5">
              Direct payout destination: <strong>JPMorgan Chase Bank (••••4892)</strong>. Weekly automated ACH transfer.
            </p>
          </div>
        </div>

        <a
          href="https://dashboard.stripe.com/express"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" className="whitespace-nowrap text-xs">
            MANAGE BANKING &rarr;
          </Button>
        </a>
      </div>

      {/* 30-Day Revenue Trend Chart */}
      <MetricChart
        title="Weekly Run Rate Inflow"
        subtitle="Gross subscriber invoice volume across all live APIs (USD)"
        data={REVENUE_TREND_DATA}
        type="bar"
        height={220}
        valueFormatter={(v) => `$${v * 10}`}
      />

      <SectionRule thickness="thin" />

      {/* Revenue Breakdown by API Table */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-2xl font-bold tracking-tight text-black">
            Monetization by Service.
          </h3>
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            MONTH-TO-DATE AUDIT
          </span>
        </div>

        <DataTable
          columns={apiRevColumns}
          data={API_REVENUE_DATA}
          keyExtractor={(item) => item.id}
        />
      </section>

      <SectionRule thickness="thin" />

      {/* Recent Payout Settlements Table */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-2xl font-bold tracking-tight text-black">
            Historical Payout Distributions.
          </h3>
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            AUTOMATED ACH TRANSFERS
          </span>
        </div>

        <DataTable
          columns={payoutColumns}
          data={PAYOUT_HISTORY}
          keyExtractor={(item) => item.id}
        />
      </section>
    </div>
  )
}
