import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import App from './App';
import { ApiError, getHvacStatus, getLastSpray, postSpray } from './api';
import type { SprayTime } from './api';

vi.mock('./api', async (importOriginal) => ({
    ...(await importOriginal<typeof import('./api')>()),
    getHvacStatus: vi.fn(),
    getLastSpray: vi.fn(),
    postSpray: vi.fn(),
}));

const SPRAY = { date: '03/21/22', time: '15:13:20' };

beforeEach(() => {
    vi.mocked(getHvacStatus).mockReset().mockResolvedValue('COOLING');
    vi.mocked(getLastSpray).mockReset().mockResolvedValue(SPRAY);
    vi.mocked(postSpray).mockReset();
});

test('shows the system status and last spray on load', async () => {
    render(<App />);

    expect(
        await screen.findByText('System status: COOLING'),
    ).toBeInTheDocument();
    expect(
        await screen.findByText('Last spray: 03/21/22 @ 15:13:20'),
    ).toBeInTheDocument();
});

test('shows Never when there have been no sprays', async () => {
    vi.mocked(getLastSpray).mockResolvedValue(null);

    render(<App />);

    expect(await screen.findByText('Last spray: Never')).toBeInTheDocument();
});

test('shows readings as unavailable when they fail to load', async () => {
    vi.mocked(getHvacStatus).mockRejectedValue(new ApiError('Down', 502));
    vi.mocked(getLastSpray).mockRejectedValue(new ApiError('Down', 500));

    render(<App />);

    expect(
        await screen.findByText('System status: Unavailable'),
    ).toBeInTheDocument();
    expect(
        await screen.findByText('Last spray: Unavailable'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('disables the button during a spray, then shows the new time', async () => {
    let finishSpray: (spray: SprayTime) => void = () => {};
    vi.mocked(postSpray).mockReturnValue(
        new Promise((resolve) => {
            finishSpray = resolve;
        }),
    );
    render(<App />);
    await screen.findByText('Last spray: 03/21/22 @ 15:13:20');

    await userEvent.click(screen.getByRole('button', { name: 'Spray' }));

    expect(screen.getByRole('button', { name: 'Spraying…' })).toBeDisabled();

    finishSpray({ date: '03/22/22', time: '09:00:00' });

    expect(
        await screen.findByText('Last spray: 03/22/22 @ 09:00:00'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Spray' })).toBeEnabled();
});

test('a failed spray shows the error and keeps the previous time', async () => {
    vi.mocked(postSpray).mockRejectedValue(
        new ApiError('The sprayer is already running', 409),
    );
    render(<App />);
    await screen.findByText('Last spray: 03/21/22 @ 15:13:20');

    await userEvent.click(screen.getByRole('button', { name: 'Spray' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
        'The sprayer is already running',
    );
    expect(
        screen.getByText('Last spray: 03/21/22 @ 15:13:20'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Spray' })).toBeEnabled();
});

test('a new spray clears the previous error', async () => {
    vi.mocked(postSpray)
        .mockRejectedValueOnce(new ApiError('Could not reach the thermostat'))
        .mockResolvedValueOnce(SPRAY);
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: 'Spray' }));
    await screen.findByRole('alert');
    await userEvent.click(screen.getByRole('button', { name: 'Spray' }));

    await screen.findByRole('button', { name: 'Spray' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
