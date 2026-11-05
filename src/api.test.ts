import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { ApiError, getHvacStatus, getLastSpray, postSpray } from './api';

const fetchMock = vi.fn();

function respondWith(status: number, body: unknown) {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('VITE_API_URL', 'http://pi.local:5000');
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
});

test('postSpray posts to the configured controller', async () => {
    respondWith(200, { date: '03/21/22', time: '15:13:20' });

    await expect(postSpray()).resolves.toEqual({
        date: '03/21/22',
        time: '15:13:20',
    });
    expect(fetchMock).toHaveBeenCalledWith('http://pi.local:5000/spray', {
        method: 'POST',
    });
});

test('errors carry the message and status from the server', async () => {
    respondWith(409, { error: 'The sprayer is already running' });

    const error = await postSpray().catch((caught) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('The sprayer is already running');
    expect(error.status).toBe(409);
});

test('errors without a JSON body fall back to the HTTP status', async () => {
    fetchMock.mockResolvedValue(new Response('<html>', { status: 500 }));

    await expect(postSpray()).rejects.toThrow('Request failed with HTTP 500');
});

test('network failures become a readable error', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(getHvacStatus()).rejects.toThrow(
        'Could not reach the controller',
    );
});

test('getLastSpray returns null when nothing has been sprayed', async () => {
    respondWith(404, { error: 'No sprays recorded' });

    await expect(getLastSpray()).resolves.toBeNull();
});

test('getLastSpray still raises other failures', async () => {
    respondWith(500, { error: 'Broken' });

    await expect(getLastSpray()).rejects.toThrow('Broken');
});

test('getHvacStatus returns the state', async () => {
    respondWith(200, { status: 'COOLING' });

    await expect(getHvacStatus()).resolves.toBe('COOLING');
});
