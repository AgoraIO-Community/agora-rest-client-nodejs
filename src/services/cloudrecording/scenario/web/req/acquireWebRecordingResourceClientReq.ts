import { StartWebRecordingResourceClientReq } from './startWebRecordingResourceClientReq'

export interface AcquireWebRecordingResourceClientReq {
    resourceExpiredHour?: number
    excludeResourceIds?: string[]
    regionAffinity?: number
    startParameter?: StartWebRecordingResourceClientReq
}
