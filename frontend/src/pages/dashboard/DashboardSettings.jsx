import React from 'react'
import InfoCard from '../../components/common/InfoCard'

function DashboardSettings() {
  return (
    <section className="content-grid">
      <InfoCard
        title="Account Settings"
        items={[
          'JWT Authentication Active',
          'Notifications Enabled',
          'Resume Visibility Set to Public',
          'Placement Alerts Active'
        ]}
      />
      <InfoCard
        title="Preferences"
        items={[
          'Daily Job Reminders',
          'Weekly Progress Summary',
          'Recruiter Instant Alerts'
        ]}
      />
    </section>
  )
}

export default DashboardSettings
