import { RecordingRequestChannelTypeEnum } from '../../types'

export interface StartResourceReq {
    cname: string
    uid: string
    clientRequest: StartClientRequest
}

export interface StartClientRequest {
    token?: string
    recordingConfig?: RecordingConfig
    recordingFileConfig?: RecordingFileConfig
    snapshotConfig?: SnapshotConfig
    storageConfig?: StorageConfig
    extensionServiceConfig?: ExtensionServiceConfig
}

export interface RecordingConfig {
    channelType?: RecordingRequestChannelTypeEnum
    streamTypes?: number
    streamMode?: string
    decryptionMode?: number
    secret?: string
    salt?: string
    audioProfile?: number
    videoStreamType?: number
    maxIdleTime?: number
    transcodingConfig?: TranscodingConfig
    subscribeAudioUids?: string[]
    unSubscribeAudioUids?: string[]
    subscribeVideoUids?: string[]
    unSubscribeVideoUids?: string[]
    subscribeUidGroup?: number
}

export interface TranscodingConfig {
    width?: number
    height?: number
    fps?: number
    bitrate?: number
    maxResolutionUid?: string
    mixedVideoLayout?: number
    backgroundColor?: string
    backgroundImage?: string
    defaultUserBackgroundImage?: string
    layoutConfig?: LayoutConfig[]
    backgroundConfig?: BackgroundConfig[]
}

export interface LayoutConfig {
    uid?: string
    x_axis?: number
    y_axis?: number
    width?: number
    height?: number
    alpha?: number
    render_mode?: number
}

export interface BackgroundConfig {
    uid?: string
    image_url?: string
    render_mode?: number
}

export interface RecordingFileConfig {
    avFileType?: string[]
}

export interface SnapshotConfig {
    captureInterval?: number
    fileType?: string[]
}

export interface StorageConfig {
    vendor?: number
    region?: number
    bucket?: string
    accessKey?: string
    secretKey?: string
    fileNamePrefix?: string[]
    stsToken?: string
    stsExpiration?: number
    extensionParams?: ExtensionParams
}

export interface ExtensionParams {
    sse?: string
    tag?: string
}

export interface ExtensionServiceConfig {
    errorHandlePolicy?: string
    extensionServices?: ExtensionService[]
    serviceParam?: ServiceParam
}

export interface ExtensionService {
    serviceName?: string
    errorHandlePolicy?: string
    serviceParam?: ServiceParam
}

export interface ServiceParam {}

export interface Outputs {
    rtmpUrl?: string
}

export interface WebRecordingServiceParam extends ServiceParam {
    url?: string
    videoBitrate?: number
    videoFps?: number
    audioProfile?: number
    mobile?: boolean
    videoWidth?: number
    videoHeight?: number
    maxRecordingHour?: number
    maxVideoDuration?: number
    onhold?: boolean
    readyTimeout?: number
}

export interface RtmpPublishServiceParam extends ServiceParam {
    outputs?: Outputs[]
}
