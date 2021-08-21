import React from 'react'
import { Container, Bar, Section } from 'react-simple-resizer'

interface LayoutProps {
  header: React.ReactNode
  left: React.ReactNode
  right: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { header, left, right } = props
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 shadow-md z-10">{header}</header>
      <Container className="flex-grow h-full">
        <Section>{left}</Section>
        <Bar size={10} className="bg-dark-700" />
        <Section>{right}</Section>
      </Container>
    </div>
  )
}
