import React from 'react'
import { Container, Bar, Section } from 'react-simple-resizer'
import useMedia from 'use-media'

interface LayoutProps {
  header: React.ReactNode
  left: React.ReactNode
  right: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { header, left, right } = props
  const isWide = useMedia({ minWidth: '800px' })
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 shadow-md z-10">{header}</header>
      <Container vertical={!isWide} className="flex-grow h-full overflow-hidden">
        <Section>{left}</Section>
        <Bar size={10} className="bg-dark-700" />
        <Section>{right}</Section>
      </Container>
    </div>
  )
}
