import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'

export const getPayload = async () => {
  return getPayloadHMR({ config })
}