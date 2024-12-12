import { StartIndividualRecordingClientReq } from './startIndividualResourceClientReq'

export interface AcquireIndividualResourceClientReq {
    resourceExpiredHour?: number
    excludeResourceIds?: string[]
    regionAffinity?: number
    startParameter?: StartIndividualRecordingClientReq
}
