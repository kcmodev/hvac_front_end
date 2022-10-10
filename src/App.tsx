import { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import logo from './images/houseIcon.svg';
import postManualSpray from './utils/api/sprayRequest';
import getTimestamp from './utils/api/timestampRequest';

function App() {
  const [time, setTime] = useState('');


  return (
    <>
      <img src={logo} className='App-logo' alt='logo' />
      <Typography className={'text'} variant='body1'>
        Last Spray: {time}
      </Typography>
      <Button
        className={'button'}
        variant='contained'
        onClick={async () => {
          await postManualSpray();
          const timestamp = await getTimestamp();
          // console.log(`setTime as ${timestamp}`);
          // @ts-ignore
            setTime(timestamp);
        }}
      >
        Spray
      </Button>
    </>
  );
}

export default App;
