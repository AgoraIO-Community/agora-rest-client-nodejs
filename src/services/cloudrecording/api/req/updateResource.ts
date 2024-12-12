import { ExtensionParams } from './startResource'

export interface UpdateResourceReq {
    cname: string
    uid: string
    clientRequest: UpdateClientRequest
}

export interface UpdateClientRequest {
    streamSubscribe?: StreamSubscribe
    webRecordingConfig?: WebRecordingConfig
    rtmpPublishConfig?: RtmpPublishConfig
}

export interface StreamSubscribe {
    audioUidList?: AudioUIDList
    videoUidList?: VideoUIDList
}

export interface AudioUIDList {
    subscribeAudioUids?: string[]
    unSubscribeAudioUids?: string[]
}

export interface VideoUIDList {
    subscribeVideoUids?: string[]
    unSubscribeVideoUids?: string[]
}

export interface WebRecordingConfig {
    onhold?: boolean
}

export interface RtmpPublishConfig {
    outputs?: UpdateOutput[]
}

export interface UpdateOutput {
    rtmpUrl?: string
}
