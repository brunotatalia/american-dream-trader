import {
  Banknote,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Compass,
  Gamepad2,
  Heart,
  LayoutDashboard,
  Trophy,
  Users,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { NAVIGATION_ITEMS } from '@/constants/uiConstants'

const ICON_MAP = {
  dashboard: LayoutDashboard,
  trading: BarChart3,
  jobs: BriefcaseBusiness,
  education: BookOpen,
  business: Building2,
  'real-estate': Compass,
  life: Heart,
  network: Users,
  banking: Banknote,
  casino: Gamepad2,
  achievements: Trophy,
}

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-white/5 bg-background-secondary/80 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="px-2">
        <h1 className="font-display text-xl font-semibold uppercase tracking-[0.4em] text-text-secondary">
          ADT
        </h1>
        <p className="mt-1 text-xs text-text-tertiary">American Dream Trader</p>
      </div>
      <nav className="mt-8 space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.id] ?? LayoutDashboard
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'text-text-tertiary hover:bg-background-tertiary/60 hover:text-text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
