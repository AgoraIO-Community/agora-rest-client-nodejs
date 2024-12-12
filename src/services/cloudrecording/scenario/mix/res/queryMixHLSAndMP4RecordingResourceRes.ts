import { MixRecordingHLSAndMP4ServerResponse } from '../../../../../services/cloudrecording/api/res/queryResource'

export interface QueryMixHLSAndMP4RecordingResourceRes {
    cname?: string
    uid?: string
    resourceId?: string
    sid?: string
    serverResponse?: MixRecordingHLSAndMP4ServerResponse
}
