'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/publisher/confirm-dialog'
import { useAuth } from '@/lib/auth'
import { Alert02Icon, CheckmarkCircle02Icon } from '@/components/icons'
import { toast } from '@/components/ui/toast'

export default function ConsumerSettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [name, setName] = useState(user?.name || 'Developer')
  const [email] = useState(user?.email || 'consumer@ephemeral.network')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    toast.success('Profile preferences updated.')
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    toast.success('Password updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleConfirmDelete = () => {
    logout()
    toast.success('Account terminated. Redirecting to home...')
    router.push('/')
  }

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="ACCOUNT // IDENTITY & SECURITY"
          title="Settings."
          subtitle="Manage developer profile credentials, security passwords, and account lifecycle."
          className="pb-0"
        />
        {savedSuccess && (
          <div className="flex items-center gap-2 p-3 border border-black bg-black text-white font-mono text-xs uppercase tracking-widest animate-in fade-in">
            <CheckmarkCircle02Icon size={14} />
            <span>SAVED</span>
          </div>
        )}
      </div>

      {/* Section 1: Developer Profile */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            01. Developer Identity
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="consumer-name">FULL NAME / ENTITY</Label>
              <Input
                id="consumer-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 text-base font-medium"
              />
            </div>

            <div>
              <Label htmlFor="consumer-email">PRIMARY EMAIL ADDRESS</Label>
              <Input
                id="consumer-email"
                value={email}
                readOnly
                className="mt-2 font-mono text-sm bg-[#F5F5F5] select-all cursor-default"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E5E5] pt-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#525252]">
              <span>ROLE:</span>
              <span className="px-2 py-0.5 bg-black text-white font-bold uppercase text-[10px]">
                {user?.role || 'CONSUMER'}
              </span>
            </div>
            <Button type="submit" variant="primary">
              UPDATE PROFILE
            </Button>
          </div>
        </form>
      </section>

      <SectionRule thickness="thick" />

      {/* Section 2: Security & Password */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            02. Security &amp; Password
          </h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <Label htmlFor="curr-pass">CURRENT PASSWORD</Label>
            <Input
              id="curr-pass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-2 text-base font-medium max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="new-pass">NEW PASSWORD</Label>
              <Input
                id="new-pass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="mt-2 text-base font-medium"
              />
            </div>
            <div>
              <Label htmlFor="conf-pass">CONFIRM NEW PASSWORD</Label>
              <Input
                id="conf-pass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="mt-2 text-base font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="secondary">
              CHANGE PASSWORD
            </Button>
          </div>
        </form>
      </section>

      <SectionRule thickness="thick" />

      {/* Section 3: Danger Zone */}
      <section className="border-2 border-black p-8 bg-white space-y-4">
        <div className="flex items-center gap-3 border-b-2 border-black pb-4">
          <div className="p-2 bg-black text-white">
            <Alert02Icon size={18} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-black">
              Danger Zone
            </h3>
            <p className="font-mono text-xs text-[#525252] uppercase tracking-widest mt-0.5">
              Permanent account termination
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="font-display text-base font-bold text-black">
              Delete Consumer Account
            </h4>
            <p className="font-serif text-xs text-[#525252] mt-0.5 leading-relaxed max-w-md">
              Permanently revokes all active API keys, halts subscription renewals, and deletes stored profile telemetry.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowDeleteModal(true)}
            className="border-2 border-black bg-black text-white hover:bg-white hover:text-black whitespace-nowrap"
          >
            DELETE ACCOUNT
          </Button>
        </div>
      </section>

      {/* Deletion Dialog */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Account?"
        description={`This action is irreversible. All API access will cease immediately. Type "${email}" to confirm:`}
        requiredConfirmString={email}
        confirmText="PERMANENTLY DELETE"
        isDestructive
      />
    </div>
  )
}
