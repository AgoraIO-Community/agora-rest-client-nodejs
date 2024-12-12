import {
    RecordingFileConfig,
    StorageConfig,
    ExtensionServiceConfig,
} from '../../../../../services/cloudrecording/api/req/startResource'

export interface StartWebRecordingResourceClientReq {
    recordingFileConfig?: RecordingFileConfig
    storageConfig?: StorageConfig
    extensionServiceConfig?: ExtensionServiceConfig
}
