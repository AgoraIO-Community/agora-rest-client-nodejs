import {
    RecordingConfig,
    RecordingFileConfig,
    StorageConfig,
} from '../../../../../services/cloudrecording/api/req/startResource'

export interface StartMixRecordingResourceClientReq {
    token?: string
    recordingConfig?: RecordingConfig
    recordingFileConfig?: RecordingFileConfig
    storageConfig?: StorageConfig
}
