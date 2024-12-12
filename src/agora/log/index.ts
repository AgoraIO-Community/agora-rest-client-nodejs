import pino from 'pino'

const logger = pino({
    level: process.env.AGORA_LOG_LEVEL || 'error',
    transport: {
        target: 'pino-pretty',
        options: {
            ignore: 'module',
            colorize: true,
            sync: true,
            messageFormat: '[{module}] {msg}',
        },
    },
})

export const getLogger = (module: string) => {
    return logger.child({ module })
}
