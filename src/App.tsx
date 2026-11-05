import { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { postSpray } from './api';

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
                    const { date, time } = await postSpray();
                    setTime(`${date} @ ${time}`);
                }}
            >
                Spray
            </Button>
        </>
    );
}

export default App;
