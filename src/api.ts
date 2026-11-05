export interface SprayTime {
    date: string;
    time: string;
}

/** A failed request, carrying a message suitable for showing to the user. */
export class ApiError extends Error {
    readonly status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_URL ?? '';

    let response: Response;
    try {
        response = await fetch(`${baseUrl}${path}`, init);
    } catch {
        throw new ApiError('Could not reach the controller');
    }

    const body = await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(
            body?.error ?? `Request failed with HTTP ${response.status}`,
            response.status,
        );
    }
    return body as T;
}

/** Runs the fan and sprayer, resolving with the spray time once the cycle completes. */
export function postSpray(): Promise<SprayTime> {
    return request<SprayTime>('/spray', { method: 'POST' });
}

/** Returns the most recent spray, or null if there hasn't been one. */
export async function getLastSpray(): Promise<SprayTime | null> {
    try {
        return await request<SprayTime>('/timestamp');
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

/** Returns the current HVAC state, such as COOLING. */
export async function getHvacStatus(): Promise<string> {
    const { status } = await request<{ status: string }>('/status');
    return status;
}
