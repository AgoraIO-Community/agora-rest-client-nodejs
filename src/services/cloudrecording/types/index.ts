export enum RecordingErrorTypeEnum {
    UnknownError = -1,
    RecordingHttpError = 0,
    RecordingNoResultError = 1,
}

export const ERR_NAMESPACE_REC = 'recording'

export enum RecordingMode {
    Individual = 'individual',
    Mix = 'mix',
    Web = 'web',
}

export enum RecordingRequestChannelTypeEnum {
    Communication = 0,
    Live = 1,
}
