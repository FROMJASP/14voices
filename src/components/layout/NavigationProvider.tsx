// import { getNavigationData, formatNavigation } from '@/lib/navigation'
import { NavigationBar } from '@/components/sections/NavigationBar'

export async function NavigationProvider() {
  // TODO: Fetch and format navigation data when NavigationBar is updated to accept props
  // const navigationData = await getNavigationData()
  // const formattedNav = formatNavigation(navigationData)
  
  // For now, return the static NavigationBar
  return <NavigationBar />
}