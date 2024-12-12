export interface QueryResourceRes {
    cname?: string
    uid?: string
    resourceId?: string
    sid?: string
    serverResponse?: any
    serverResponseType?: ServerResponseType
    queryIndividualRecordingServerResponse?: QueryIndividualRecordingServerResponse
    queryIndividualVideoScreenshotServerResponse?: QueryIndividualVideoScreenshotServerResponse
    mixRecordingHLSServerResponse?: MixRecordingHLSServerResponse
    mixRecordingHLSAndMP4ServerResponse?: MixRecordingHLSAndMP4ServerResponse
    webRecordingServerResponse?: WebRecordingServerResponse
}

export enum ServerResponseType {
    QUERY_SERVER_RESPONSE_UNKNOWN_TYPE,
    QUERY_INDIVIDUAL_RECORDING_SERVER_RESPONSE_TYPE,
    QUERY_INDIVIDUAL_VIDEO_SCREENSHOT_SERVER_RESPONSE_TYPE,
    QUERY_MIX_RECORDING_HLS_SERVER_RESPONSE_TYPE,
    QUERY_MIX_RECORDING_HLS_AND_MP4_SERVER_RESPONSE_TYPE,
    QUERY_WEB_RECORDING_SERVER_RESPONSE_TYPE,
}

export interface QueryIndividualRecordingServerResponse {
    status?: number
    fileListMode?: string
    fileList?: FileDetail[]
    sliceStartTime?: number
}

export interface FileDetail {
    fileName?: string
    trackType?: string
    uid?: string
    mixedAllUser?: boolean
    isPlayable?: boolean
    sliceStartTime?: number
}

export interface QueryIndividualVideoScreenshotServerResponse {
    status?: number
    sliceStartTime?: number
}

export interface MixRecordingHLSServerResponse {
    status?: number
    fileListMode?: string
    fileList?: string
    sliceStartTime?: number
}

export interface MixRecordingHLSAndMP4ServerResponse {
    status?: number
    fileListMode?: string
    fileList?: FileDetail[]
    sliceStartTime?: number
}

export interface WebRecordingServerResponse {
    status?: number
    extensionServiceState?: ExtensionServiceState[]
}

export interface ExtensionServiceState {
    payload?: Payload
    serviceName?: string
}

export interface Payload {
    fileList?: FileDetail[]
    onhold?: boolean
    state?: string
    outputs?: Output[]
}

export interface Output {
    rtmpUrl?: string
    status?: string
}
