import { QueryIndividualRecordingServerResponse } from '../../../../../services/cloudrecording/api/res/queryResource'

export interface QueryIndividualRecordingResourceRes {
    cname?: string
    uid?: string
    resourceId?: string
    sid?: string
    serverResponse?: QueryIndividualRecordingServerResponse
}
