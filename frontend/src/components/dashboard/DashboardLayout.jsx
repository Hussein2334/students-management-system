import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Search, Bell, MessageSquare, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  LogOut, User as UserIcon
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({
  children,
  title,
  subtitle,
  menuItems,
  menuSections = null,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Load hali ya sidebar
  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  // Hifadhi hali
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(collapsed))
  }, [collapsed])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
      isActive
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    } ${collapsed ? 'justify-center' : ''}`

  const sections = menuSections || [{ title: null, items: menuItems }]

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gray-50">

      {/* ============ SIDEBAR (FIXED) ============ */}
      <aside
        className={`flex-shrink-0 h-screen sidebar-gradient text-white transition-all duration-300 ease-in-out flex flex-col ${
          collapsed ? 'w-20' : 'w-72'
        } ${
          // Kwenye mobile, sidebar inaonekana kwa msimbo wa drawer
          'fixed lg:relative z-50 lg:translate-x-0 ' +
          (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
        }`}
      >

        {/* ============ HEADER: LOGO + ARROW ============ */}
        <div className={`flex items-center h-20 border-b border-white/10 flex-shrink-0 ${
          collapsed ? 'justify-center px-0' : 'justify-between px-5'
        }`}>

          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-brand-600 font-extrabold text-lg font-display">S</span>
            </div>
            <div className={`leading-none transition-all duration-300 ${
              collapsed ? 'hidden opacity-0 w-0' : 'opacity-100'
            }`}>
              <div className="text-white font-extrabold text-base font-display whitespace-nowrap">
                ShulePro
              </div>
              <div className="text-white/50 text-[10px] tracking-[0.15em] uppercase mt-1 whitespace-nowrap">
                v1.0
              </div>
            </div>
          </Link>

          {/* ARROW — Desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition flex-shrink-0"
            title={collapsed ? 'Panua sidebar' : 'Kunja sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>

          {/* Close — Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============ MENU (scrollable) ============ */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll p-3 space-y-5">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.title && !collapsed && (
                <div className="px-4 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 whitespace-nowrap">
                  {section.title}
                </div>
              )}
              {section.title && collapsed && (
                <div className="h-px bg-white/10 mx-3 mb-2"></div>
              )}
              <div className="space-y-1">
                {section.items.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={i}
                      to={item.path}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={navClass}
                      title={collapsed ? item.label : ''}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                      {!collapsed && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                      {item.badge && !collapsed && (
                        <span className="ml-auto text-[10px] px-2 py-0.5 bg-red-500 text-white font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}

                      {collapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow-xl hidden lg:block">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ============ LOGOUT (fixed at bottom) ============ */}
        <div className="flex-shrink-0 p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/10 transition ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Toka"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Toka</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        ></div>
      )}

      {/* ============ MAIN COLUMN (fixed topbar + scrollable content) ============ */}
      <div className="flex-1 flex flex-col h-screen min-w-0">

        {/* TOPBAR — FIXED */}
        <header className="flex-shrink-0 h-20 bg-white border-b border-gray-200 flex items-center px-5 lg:px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search authorized dashboard items..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex-1 md:hidden"></div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <span className="text-sm font-semibold text-gray-700">EN</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>

            <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.username?.toUpperCase() || user?.first_name}
                  </div>
                  <div className="text-[11px] text-gray-500 capitalize">
                    {user?.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div onClick={() => setUserMenuOpen(false)} className="fixed inset-0 z-40"></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="w-4 h-4" />
                      Wasifu Wangu
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Toka
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT — SCROLLABLE */}
        <main className="flex-1 overflow-y-auto px-5 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-brand-600 font-semibold capitalize">{user?.role}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">{title}</span>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}