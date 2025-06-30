import { NavigationBar, HeroSection, VoiceoverShowcase } from '@/components/sections'

export default function DemoPage() {
  return (
    <>
      <NavigationBar />
      <main>
        <HeroSection />
        <VoiceoverShowcase />
      </main>
    </>
  )
}

export const metadata = {
  title: '14voices - Professionele Voice-overs',
  description: 'Ontdek de perfecte stem voor uw project. Van commercials tot bedrijfsfilms, wij hebben de juiste voice-over voor elke productie.',
}