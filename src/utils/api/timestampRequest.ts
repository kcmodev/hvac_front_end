import { PI_IP_ADDR } from '../../conf.js';

const getTimestamp = async () => {
    let timestamp;

    await fetch(`http://${PI_IP_ADDR}/timestamp`,
        {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            let date = data['date'];
            let time = data['time'];
            timestamp = `${date} @ ${time}`
            // console.log(`TIMESTAMP: \n "${timestamp}"`)
            // console.log('GET from /timestamp')
        })
        .catch(err => console.error(err))

    return timestamp
};

export default getTimestamp;
