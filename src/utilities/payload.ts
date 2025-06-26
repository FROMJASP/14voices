import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'
import { headers } from 'next/headers'

export const getPayload = async () => {
  return getPayloadHMR({ config })
}

export const getServerSideUser = async () => {
  const payload = await getPayload()
  const headersList = await headers()
  
  try {
    const { user } = await payload.auth({ headers: headersList })
    return user
  } catch {
    return null
  }
}