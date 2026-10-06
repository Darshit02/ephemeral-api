'use client'

import React, { useState } from 'react'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable, Column } from '@/components/publisher/data-table'
import { ConfirmDialog } from '@/components/publisher/confirm-dialog'
import {
  Key01Icon,
  PlusSignIcon,
  Delete01Icon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  Copy01Icon,
} from '@/components/icons'

interface ApiKeyItem {
  id: string
  name: string
  prefix: string
  scope: string
  created: string
  lastUsed: string
}

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: 'k-1',
    name: 'CI/CD Automated Deployment',
    prefix: 'eph_live_9a48••••••••••••31b2',
    scope: 'WRITE:APIS, WRITE:PLANS',
    created: 'AUG 12, 2026',
    lastUsed: '14M AGO',
  },
  {
    id: 'k-2',
    name: 'Production Telemetry Exporter',
    prefix: 'eph_live_12c4••••••••••••99f0',
    scope: 'READ:ANALYTICS',
    created: 'SEP 04, 2026',
    lastUsed: 'YESTERDAY',
  },
]

export default function PublisherSettingsPage() {
  // Organization profile
  const [orgName, setOrgName] = useState('Ephemeral Machine Intelligence')
  const [orgSlug, setOrgSlug] = useState('ephemeral-mi')
  const [supportEmail, setSupportEmail] = useState('publisher@ephemeral.network')
  const [website, setWebsite] = useState('https://ephemeral.network')

  // Notification preferences
  const [notifySubscriber, setNotifySubscriber] = useState(true)
  const [notifyDowntime, setNotifyDowntime] = useState(true)
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false)

  // Webhook
  const [webhookUrl, setWebhookUrl] = useState('https://api.internal.network/webhooks/ephemeral')
  const [webhookSecret] = useState('whsec_99a812be40f8c371092a')
  const [webhookPingStatus, setWebhookPingStatus] = useState<'idle' | 'testing' | 'success'>('idle')

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [revokeKeyId, setRevokeKeyId] = useState<string | null>(null)

  // Account Deletion
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveProfile = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const handleTestWebhook = () => {
    setWebhookPingStatus('testing')
    setTimeout(() => {
      setWebhookPingStatus('success')
      setTimeout(() => setWebhookPingStatus('idle'), 3000)
    }, 600)
  }

  const handleCreateApiKey = () => {
    if (!newKeyName) return
    const rawKey = `eph_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`
    const newRecord: ApiKeyItem = {
      id: `k-${Date.now()}`,
      name: newKeyName,
      prefix: `${rawKey.substring(0, 12)}••••••••••••${rawKey.substring(rawKey.length - 4)}`,
      scope: 'ADMIN:FULL',
      created: 'JUST NOW',
      lastUsed: 'NEVER',
    }
    setApiKeys((prev) => [newRecord, ...prev])
    setNewlyCreatedKey(rawKey)
    setNewKeyName('')
  }

  const handleConfirmRevokeKey = () => {
    if (!revokeKeyId) return
    setApiKeys((prev) => prev.filter((k) => k.id !== revokeKeyId))
    setRevokeKeyId(null)
  }

  const keyColumns: Column<ApiKeyItem>[] = [
    {
      key: 'name',
      header: 'TOKEN PURPOSE',
      render: (item) => (
        <div>
          <span className="font-bold text-black group-hover:text-white block">
            {item.name}
          </span>
          <span className="font-mono text-xs text-[#525252] group-hover:text-white block mt-0.5 select-all">
            {item.prefix}
          </span>
        </div>
      ),
    },
    {
      key: 'scope',
      header: 'PERMISSIONS',
      render: (item) => (
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#525252] group-hover:text-white">
          {item.scope}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'CREATED',
      render: (item) => (
        <span className="font-mono text-xs text-[#525252] group-hover:text-white">
          {item.created}
        </span>
      ),
    },
    {
      key: 'lastUsed',
      header: 'LAST USED',
      render: (item) => (
        <span className="font-mono text-xs">{item.lastUsed}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setRevokeKeyId(item.id)
          }}
          className="p-1.5 border border-transparent hover:border-black text-[#525252] hover:text-white transition-none"
          title="Revoke Token"
        >
          <Delete01Icon size={16} />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="ORGANIZATION // CREDENTIALS & SECURITY PROTOCOL"
          title="Settings."
          subtitle="Organization identity, programmatic admin API keys, webhook endpoints, and notifications."
          className="pb-0"
        />
        {saveSuccess && (
          <div className="flex items-center gap-2 p-3 border border-black bg-black text-white font-mono text-xs uppercase tracking-widest animate-in fade-in">
            <CheckmarkCircle02Icon size={14} />
            <span>SAVED</span>
          </div>
        )}
      </div>

      {/* Section 1: Organization Profile */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            01. Organization Profile
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="org-name">ORGANIZATION NAME</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-2 text-base font-medium"
              />
            </div>
            <div>
              <Label htmlFor="org-slug">HANDLE / SLUG</Label>
              <Input
                id="org-slug"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                className="mt-2 font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="support-email">SUPPORT &amp; INVOICING EMAIL</Label>
              <Input
                id="support-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="mt-2 font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="org-website">OFFICIAL WEBSITE</Label>
              <Input
                id="org-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-2 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSaveProfile}>
          UPDATE ORGANIZATION DETAILS
        </Button>
      </div>

      <SectionRule thickness="thin" />

      {/* Section 2: Administrative Publisher API Keys */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b-2 border-black pb-3">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-black">
              02. Administrative API Keys
            </h2>
            <p className="font-serif text-xs text-[#525252] mt-0.5">
              Bearer tokens utilized to programmatically manage your catalog and retrieve analytics via Ephemeral Admin API.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowNewKeyModal(true)}
            className="flex items-center gap-2 text-xs"
          >
            <PlusSignIcon size={14} />
            <span>CREATE NEW TOKEN</span>
          </Button>
        </div>

        {/* Newly Created Key Alert Box */}
        {newlyCreatedKey && (
          <div className="border-2 border-black p-6 bg-white space-y-3">
            <div className="flex items-center gap-2 text-black font-bold font-mono text-xs uppercase tracking-widest">
              <CheckmarkCircle02Icon size={16} />
              <span>TOKEN CREATED &bull; STORE IMMEDIATELY</span>
            </div>
            <p className="font-serif text-xs text-[#525252]">
              This administrative secret is only visible right now. It will never be shown again:
            </p>
            <div className="p-3 bg-[#F5F5F5] border border-black font-mono text-xs flex items-center justify-between gap-4">
              <span className="select-all font-bold text-black break-all">{newlyCreatedKey}</span>
              <button
                onClick={() => navigator.clipboard.writeText(newlyCreatedKey)}
                className="p-1.5 bg-black text-white hover:bg-white hover:text-black border border-black transition-none uppercase tracking-wider text-[10px]"
              >
                <Copy01Icon size={12} />
              </button>
            </div>
            <Button variant="secondary" onClick={() => setNewlyCreatedKey(null)} className="text-[10px] py-1 px-3">
              I HAVE SAVED IT
            </Button>
          </div>
        )}

        {/* Create Token Modal / Card */}
        {showNewKeyModal && !newlyCreatedKey && (
          <div className="border border-black p-6 bg-white space-y-4">
            <h3 className="font-display text-lg font-bold tracking-tight text-black">
              Issue Administrative Key
            </h3>
            <div>
              <Label htmlFor="key-name">KEY PURPOSE / APPLICATION</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. GitHub Actions Deployment Pipeline"
                className="mt-2 font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowNewKeyModal(false)}>
                CANCEL
              </Button>
              <Button variant="primary" disabled={!newKeyName} onClick={handleCreateApiKey}>
                GENERATE TOKEN
              </Button>
            </div>
          </div>
        )}

        <DataTable
          columns={keyColumns}
          data={apiKeys}
          keyExtractor={(item) => item.id}
        />
      </section>

      <SectionRule thickness="thin" />

      {/* Section 3: Webhook Notification Destinations */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            03. Webhook Destinations
          </h2>
          <p className="font-serif text-xs text-[#525252] mt-0.5">
            Receive signed JSON webhooks when new consumers subscribe, cancel, or generate invoices.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="webhook-url">WEBHOOK ENDPOINT URL</Label>
            <div className="mt-2 flex gap-3">
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="font-mono text-sm flex-1"
              />
              <Button
                variant="secondary"
                onClick={handleTestWebhook}
                disabled={webhookPingStatus === 'testing'}
                className="whitespace-nowrap text-xs"
              >
                {webhookPingStatus === 'testing' ? 'SENDING PING...' : webhookPingStatus === 'success' ? '200 OK PONG' : 'TEST PING'}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="webhook-secret">WEBHOOK SIGNING SECRET (HMAC-SHA256)</Label>
            <Input
              id="webhook-secret"
              value={webhookSecret}
              readOnly
              className="mt-2 font-mono text-xs bg-[#F5F5F5] select-all cursor-default"
            />
          </div>
        </div>
      </section>

      <SectionRule thickness="thin" />

      {/* Section 4: Email & Alert Preferences */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            04. Alert &amp; Communication Preferences
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              checked: notifySubscriber,
              onChange: () => setNotifySubscriber(!notifySubscriber),
              label: 'NEW SUBSCRIBER NOTIFICATIONS',
              desc: 'Receive immediate email dispatch whenever a consumer subscribes to any paid or free plan.',
            },
            {
              checked: notifyDowntime,
              onChange: () => setNotifyDowntime(!notifyDowntime),
              label: 'ORIGIN HEALTH PROBE FAILURES',
              desc: 'High-priority SMS & email alerts if origin upstream returns non-200 responses 3 consecutive times.',
            },
            {
              checked: notifyWeeklyDigest,
              onChange: () => setNotifyWeeklyDigest(!notifyWeeklyDigest),
              label: 'WEEKLY FINANCIAL & USAGE DIGEST',
              desc: 'Consolidated Monday morning telemetry and gross revenue summary report.',
            },
          ].map((pref, idx) => (
            <label
              key={idx}
              className="flex items-start gap-3.5 p-4 border border-[#E5E5E5] hover:border-black cursor-pointer bg-white transition-none"
            >
              <input
                type="checkbox"
                checked={pref.checked}
                onChange={pref.onChange}
                className="mt-1 w-4 h-4 rounded-none accent-black border-2 border-black cursor-pointer"
              />
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-black font-bold block">
                  {pref.label}
                </span>
                <span className="font-serif text-xs text-[#525252] block mt-0.5 leading-relaxed">
                  {pref.desc}
                </span>
              </div>
            </label>
          ))}
        </div>
      </section>

      <SectionRule thickness="thick" />

      {/* Section 5: Account Danger Zone */}
      <section className="border-2 border-black p-8 bg-white space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-black pb-4">
          <div className="p-2 bg-black text-white">
            <Alert02Icon size={18} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-black">
              Danger Zone
            </h2>
            <p className="font-mono text-xs text-[#525252] uppercase tracking-widest mt-0.5">
              Permanent organization deactivation
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-base font-bold text-black">
              Delete Publisher Organization
            </h3>
            <p className="font-serif text-xs text-[#525252] mt-1 leading-relaxed max-w-md">
              Permanently purges your publisher entity, revokes all API keys, closes active Stripe Connect accounts, and deprovisions all live service gateways.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowDeleteAccountModal(true)}
            className="whitespace-nowrap bg-black text-white hover:bg-white hover:text-black border-2 border-black"
          >
            DELETE ORGANIZATION
          </Button>
        </div>
      </section>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={Boolean(revokeKeyId)}
        onClose={() => setRevokeKeyId(null)}
        onConfirm={handleConfirmRevokeKey}
        title="Revoke Administrative Key?"
        description="Any automated CI/CD scripts or backend processes utilizing this key will immediately receive HTTP 401 Unauthorized."
        confirmText="REVOKE KEY"
        isDestructive
      />

      <ConfirmDialog
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={() => {
          window.location.href = '/'
        }}
        title="Permanently Delete Organization?"
        description={`This action cannot be reversed. To confirm, type "${orgSlug}" below:`}
        requiredConfirmString={orgSlug}
        confirmText="DELETE ORGANIZATION"
        isDestructive
      />
    </div>
  )
}
