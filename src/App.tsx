import { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import postManualSpray from './utils/api/sprayRequest';
import getTimestamp from './utils/api/timestampRequest';

function App() {
    const [time, setTime] = useState('');

    return (
        <>
            <img src="/houseIcon.svg" alt="" />
            <Typography className={'text'} variant="body1">
                Last Spray: {time}
            </Typography>
            <Button
                className={'button'}
                variant="contained"
                onClick={async () => {
                    await postManualSpray();
                    const timestamp = await getTimestamp();
                    setTime(timestamp ?? '');
                }}
            >
                Spray
            </Button>
        </>
    );
}

export default App;
