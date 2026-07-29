import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const sidebarWidth = isCollapsed ? '64px' : '260px'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />
      <div
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <TopNavbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
