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

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-white/10 bg-background-secondary/95 px-4 py-3 backdrop-blur-xl md:hidden">
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.id] ?? LayoutDashboard
        const isActive = location.pathname === item.path

        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center text-xs ${
              isActive ? 'text-accent-primary' : 'text-text-tertiary'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="mt-1">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
