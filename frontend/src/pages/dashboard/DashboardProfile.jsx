import React from 'react'
import { useOutletContext } from 'react-router-dom'
import InfoCard from '../../components/common/InfoCard'

function DashboardProfile(props) {
  const context = useOutletContext() || {}
  const activeUser = props.activeUser || context.activeUser

  return (
    <section className="content-grid">
      <InfoCard
        title="Profile Snapshot"
        items={[
          `Name: ${activeUser?.displayName || activeUser?.name || 'Student User'}`,
          `Email: ${activeUser?.email || 'N/A'}`,
          `Role: ${activeUser?.role ? activeUser.role.toUpperCase() : 'STUDENT'}`,
          `College: ${activeUser?.college || 'Technology Institute'}`,
          `Branch: ${activeUser?.branch || 'Computer Science'}`
        ]}
      />
      <InfoCard
        title="Skill & Career Radar"
        items={[
          `Skills: ${activeUser?.skills || 'React, JavaScript, Node.js, Express'}`,
          'Graduation Year: 2026',
          'Preferred Roles: Software Developer, Product Engineer',
          'JWT Status: Authenticated & Session Active'
        ]}
      />
    </section>
  )
}

export default DashboardProfile
