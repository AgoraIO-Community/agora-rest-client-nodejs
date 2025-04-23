import {
    RecordingConfig,
    RecordingFileConfig,
    SnapshotConfig,
    StorageConfig,
} from '../../../api/req/startResource'

export interface StartIndividualRecordingClientReq {
    token?: string
    recordingConfig?: RecordingConfig
    recordingFileConfig?: RecordingFileConfig
    snapshotConfig?: SnapshotConfig
    storageConfig?: StorageConfig
}
