import { DomainArea } from '../types'
import { Credential } from '../auth/auth'

export interface AgoraConfig {
    appId?: string
    credential?: Credential
    domainArea: DomainArea
    httpTimeout?: number
}
