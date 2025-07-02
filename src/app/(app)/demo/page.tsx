import { NavigationBar, VoiceoverShowcase } from '@/components/sections'
import { UnifiedHero } from '@/components/unified'

export default function DemoPage() {
  return (
    <>
      <NavigationBar />
      <main>
        <UnifiedHero variant="page" />
        <VoiceoverShowcase />
      </main>
    </>
  )
}

export const metadata = {
  title: '14voices - Professionele Voice-overs',
  description: 'Ontdek de perfecte stem voor uw project. Van commercials tot bedrijfsfilms, wij hebben de juiste voice-over voor elke productie.',
}