import { StartMixRecordingResourceClientReq } from './startMixRecordingResourceClientReq'

export interface AcquireMixRecordingResourceClientReq {
    resourceExpiredHour?: number
    excludeResourceIds?: string[]
    regionAffinity?: number
    startParameter?: StartMixRecordingResourceClientReq
}
