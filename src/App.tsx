import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import './App.css';
import { ApiError, getHvacStatus, getLastSpray, postSpray } from './api';
import type { SprayTime } from './api';

const LOADING = 'Loading…';
const UNAVAILABLE = 'Unavailable';

function formatSpray({ date, time }: SprayTime): string {
    return `${date} @ ${time}`;
}

function App() {
    const [hvacStatus, setHvacStatus] = useState(LOADING);
    const [lastSpray, setLastSpray] = useState(LOADING);
    const [isSpraying, setIsSpraying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCurrent = true;
        const unlessStale =
            <T,>(update: (value: T) => void) =>
            (value: T) => {
                if (isCurrent) {
                    update(value);
                }
            };

        getHvacStatus()
            .then(unlessStale(setHvacStatus))
            .catch(unlessStale(() => setHvacStatus(UNAVAILABLE)));
        getLastSpray()
            .then(
                unlessStale((spray) =>
                    setLastSpray(spray ? formatSpray(spray) : 'Never'),
                ),
            )
            .catch(unlessStale(() => setLastSpray(UNAVAILABLE)));

        return () => {
            isCurrent = false;
        };
    }, []);

    async function handleSpray() {
        setIsSpraying(true);
        setError(null);
        try {
            setLastSpray(formatSpray(await postSpray()));
        } catch (caught) {
            setError(
                caught instanceof ApiError
                    ? caught.message
                    : 'Something went wrong',
            );
        } finally {
            setIsSpraying(false);
        }
    }

    return (
        <main className="app">
            <img src="/houseIcon.svg" alt="" />
            <Typography variant="h5" component="h1">
                HVAC Air Freshener
            </Typography>
            <div>
                <Typography>System status: {hvacStatus}</Typography>
                <Typography>Last spray: {lastSpray}</Typography>
            </div>
            <Button
                variant="contained"
                disabled={isSpraying}
                onClick={handleSpray}
            >
                {isSpraying ? 'Spraying…' : 'Spray'}
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
        </main>
    );
}

export default App;
