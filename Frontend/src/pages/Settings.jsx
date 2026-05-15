import { useState } from 'react';
import { FiGlobe, FiLock, FiMoon, FiSliders, FiVolume2 } from 'react-icons/fi';
import Layout from '../components/Layout';
import { SectionHeading, SurfaceCard } from '../components/UiPrimitives';

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-indigo-100/70 px-4 py-3 dark:border-slate-700">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState({
    announcements: true,
    sounds: false,
    privateProfile: false,
    reminderEmails: true,
  });

  const toggleSetting = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Layout title="Settings" subtitle="Customize your LMS experience, preferences, and privacy controls.">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Preferences" subtitle="Notification, playback, and interface behavior." />
          <div className="space-y-3">
            <Toggle
              checked={settings.announcements}
              onChange={() => toggleSetting('announcements')}
              label="Announcements"
              hint="Receive updates about new courses and sessions."
            />
            <Toggle
              checked={settings.sounds}
              onChange={() => toggleSetting('sounds')}
              label="Sound effects"
              hint="Enable gamification sounds and celebration effects."
            />
            <Toggle
              checked={settings.reminderEmails}
              onChange={() => toggleSetting('reminderEmails')}
              label="Reminder emails"
              hint="Get session and assignment reminders by email."
            />
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Privacy & Security" subtitle="Account-level security and profile visibility." />
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-indigo-100/70 px-4 py-3 dark:border-slate-700">
              <p className="font-medium text-slate-800 dark:text-slate-100">
                <FiLock className="mr-2 inline text-indigo-500" />
                Password
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Last updated 12 days ago.</p>
            </div>
            <div className="rounded-xl border border-indigo-100/70 px-4 py-3 dark:border-slate-700">
              <p className="font-medium text-slate-800 dark:text-slate-100">
                <FiGlobe className="mr-2 inline text-indigo-500" />
                Language
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">English (India)</p>
            </div>
            <Toggle
              checked={settings.privateProfile}
              onChange={() => toggleSetting('privateProfile')}
              label="Private profile mode"
              hint="Hide profile details from non-team members."
            />
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-2xl p-5 xl:col-span-2">
          <SectionHeading title="Experience Controls" subtitle="Fine tune motion, audio, and display intensity." />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { icon: FiMoon, title: 'Theme', desc: 'Auto-switch with manual override.' },
              { icon: FiVolume2, title: 'Audio', desc: 'Session and notification volumes.' },
              { icon: FiSliders, title: 'Animations', desc: 'Set smoothness and interaction speed.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <item.icon className="text-indigo-500" />
                <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </Layout>
  );
}

export default Settings;
