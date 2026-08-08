function SettingsTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-outline-variant/30">
      <nav className="-mb-px flex gap-0 overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onTabChange(tab)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-label-sm font-medium transition-colors focus-visible:outline-none focus-visible:text-primary ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default SettingsTabs
