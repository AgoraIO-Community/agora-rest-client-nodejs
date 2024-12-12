import {
    AppsCollection,
    RecordingConfig,
    TranscodeOptions,
    RecordingFileConfig,
    SnapshotConfig,
    StorageConfig,
} from '../../../api/req/startResource'

export interface StartIndividualRecordingClientReq {
    token?: string
    appsCollection?: AppsCollection
    recordingConfig?: RecordingConfig
    transcodeOptions?: TranscodeOptions
    recordingFileConfig?: RecordingFileConfig
    snapshotConfig?: SnapshotConfig
    storageConfig?: StorageConfig
}
