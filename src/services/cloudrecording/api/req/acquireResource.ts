import { StartClientRequest } from './startResource'

export interface AcquireResourceReq {
    cname: string
    uid: string
    clientRequest: AcquireClientRequest
}

export interface AcquireClientRequest {
    scene?: number
    resourceExpiredHour?: number
    excludeResourceIds?: string[]
    regionAffinity?: number
    startParameter?: StartClientRequest
}
