import { MixRecordingHLSServerResponse } from '../../../../../services/cloudrecording/api/res/queryResource'

export interface QueryMixHLSRecordingResourceRes {
    cname?: string
    uid?: string
    resourceId?: string
    sid?: string
    serverResponse?: MixRecordingHLSServerResponse
}
