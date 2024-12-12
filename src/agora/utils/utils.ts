import { GenericError } from './error'
import { ERR_NAMESPACE_LIB } from './constant'
import { ErrorTypeEnum } from '../types'

export const base64 = (stringValue: string): string => {
    return Buffer.from(stringValue).toString('base64')
}

export async function retry<T>(
    target: any,
    operation: (retryCount: number) => Promise<T>,
    retryShouldStop: () => boolean,
    options?: {
        delay?: (retryCount: number) => number
        onFailAttempt?: (err: GenericError) => void
    },
): Promise<[err?: GenericError, result?: T]> {
    let retryCount = 0
    let stopRetry: boolean = retryShouldStop()
    let error: GenericError | undefined
    const delay = options && options.delay
    const onFailAttempt = options && options.onFailAttempt
    while (!stopRetry) {
        try {
            const result = await operation.apply(target, [retryCount])
            return [undefined, result]
        } catch (e) {
            error = GenericError.wrapError(
                ERR_NAMESPACE_LIB,
                ErrorTypeEnum.UnknownError,
                e as Error,
            )
            onFailAttempt && onFailAttempt(error)
            if (error.options.immediateStopRetry) {
                return [error, undefined]
            }
        }

        stopRetry = retryShouldStop()
        if (!stopRetry && delay) {
            // only wait when there's next action
            await new Promise((resolve) => setTimeout(resolve, delay(retryCount)))
        }
        retryCount++
    }
    return [error, undefined]
}
