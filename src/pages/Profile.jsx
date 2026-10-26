import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import Field from '../components/ui/Field'
import { inputClass, primaryButton, secondaryButton } from '../components/ui/styles'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState({ name: user.name, phone: user.phone ?? '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [savingPassword, setSavingPassword] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    const found = {}
    if (!profile.name.trim()) found.name = 'Name is required'
    if (profile.phone && !/^[6-9]\d{9}$/.test(profile.phone)) found.phone = 'Enter a valid 10-digit mobile number'
    setProfileErrors(found)
    if (Object.keys(found).length) return

    setSavingProfile(true)
    try {
      setUser(await api.auth.updateProfile({ name: profile.name.trim(), phone: profile.phone }))
      toast.success('Profile updated')
    } catch (err) {
      if (Object.keys(err.fieldErrors ?? {}).length) setProfileErrors(err.fieldErrors)
      else toast.error(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    const found = {}
    if (!passwords.currentPassword) found.currentPassword = 'Enter your current password'
    if (passwords.newPassword.length < 8) found.newPassword = 'Use at least 8 characters'
    setPasswordErrors(found)
    if (Object.keys(found).length) return

    setSavingPassword(true)
    try {
      await api.auth.changePassword(passwords)
      setPasswords({ currentPassword: '', newPassword: '' })
      toast.success('Password changed')
    } catch (err) {
      if (Object.keys(err.fieldErrors ?? {}).length) setPasswordErrors(err.fieldErrors)
      else toast.error(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold">Your account</h1>

      <form onSubmit={saveProfile} noValidate className="space-y-4 rounded-2xl border border-line bg-white p-6">
        <h2 className="text-lg font-bold">Profile</h2>
        <Field label="Email" htmlFor="profile-email" hint="Your email is your sign-in and cannot be changed here.">
          <input id="profile-email" className={inputClass} value={user.email} disabled />
        </Field>
        <Field label="Full name" htmlFor="profile-name" error={profileErrors.name}>
          <input id="profile-name" className={inputClass} value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
        </Field>
        <Field label="Mobile number" htmlFor="profile-phone" error={profileErrors.phone}>
          <input id="profile-phone" className={inputClass} inputMode="numeric" maxLength={10} value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
        </Field>
        <button className={primaryButton} disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save changes'}</button>
      </form>

      <form onSubmit={savePassword} noValidate className="space-y-4 rounded-2xl border border-line bg-white p-6">
        <h2 className="text-lg font-bold">Change password</h2>
        <Field label="Current password" htmlFor="current-password" error={passwordErrors.currentPassword}>
          <input id="current-password" type="password" autoComplete="current-password" className={inputClass} value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} />
        </Field>
        <Field label="New password" htmlFor="new-password" error={passwordErrors.newPassword} hint="At least 8 characters.">
          <input id="new-password" type="password" autoComplete="new-password" className={inputClass} value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} />
        </Field>
        <button className={primaryButton} disabled={savingPassword}>{savingPassword ? 'Updating…' : 'Update password'}</button>
      </form>

      <button className={secondaryButton} onClick={logout}>
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </div>
  )
}
