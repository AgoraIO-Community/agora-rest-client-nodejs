import { RequestInit } from 'node-fetch'

/**
 * Credential interface defines the authentication methods required
 * for Agora API requests
 */
export interface Credential {
    /**
     * Returns the name of the credential
     */
    getName(): string

    /**
     * Sets authentication headers/parameters on the request
     * @param init The request initialization options to authenticate
     */
    setAuth(headers: Record<string, string>): void
}
