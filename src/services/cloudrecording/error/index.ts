import { GenericError } from '../../../agora/utils'
import { ERR_NAMESPACE_REC, RecordingErrorTypeEnum } from '../types'

export class AgoraCloudRecordingSDKHttpError {
    statusCode: number = -1
    static error(statusCode: number): GenericError {
        const err = GenericError.wrapMessage(
            ERR_NAMESPACE_REC,
            RecordingErrorTypeEnum.RecordingHttpError,
            'RecordingHttpError',
            'Http Error',
        )
        if (statusCode >= 500 && statusCode < 510) {
            // 50x
            err.message = `Http Error ${statusCode}: Timeout`
        } else if (statusCode >= 400 && statusCode < 410) {
            // 40x
            err.message = `Http Error ${statusCode}: Invalid Parameters`
        } else {
            err.message = `Http Error ${statusCode}: Unknown`
        }
        return err
    }
}
