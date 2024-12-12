import { RequestInit } from 'node-fetch'
import { Credential } from './auth'
import { base64 } from '../utils'

export class BasicCredential implements Credential {
    private readonly username: string
    private readonly password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }

    getName(): string {
        return 'basic_auth'
    }

    setAuth(headers: Record<string, string>): void {
        const base64Credentials = base64(`${this.username}:${this.password}`)

        headers.authorization = `Basic ${base64Credentials}`
    }
}
