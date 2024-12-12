export type GenericErrorOptions = {
    immediateStopRetry?: boolean
}

export class GenericError extends Error {
    namespace: string
    code: number
    body: any
    options: Record<string, boolean> = {}

    constructor(namespace: string, code: number, error: Error) {
        super()
        this.namespace = namespace
        this.code = code
        this.message = error.message
        this.name = error.name
        this.stack = error.stack
    }

    static wrapError(
        namespace: string,
        code: number,
        error: Error,
        options?: GenericErrorOptions,
    ): GenericError {
        let err: GenericError

        if (error instanceof GenericError && error.code !== -1) {
            err = error
        } else {
            err = new GenericError(namespace, code, error)
        }

        if (options) {
            err.options = Object.assign(err.options, options)
        }
        return err
    }

    static wrapMessage(
        namespace: string,
        code: number,
        name: string,
        message: string,
        options?: GenericErrorOptions,
    ): GenericError {
        const e = new Error(message)
        e.name = name
        const err = GenericError.wrapError(namespace, code, e, options)
        return err
    }
}
