interface SettingsSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {children}
    </div>
  )
}