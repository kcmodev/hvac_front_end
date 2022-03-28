import { PI_IP_ADDR } from '../../conf.js';

const postManualSpray = async () => {
  await fetch(`http://${PI_IP_ADDR}/spray`,
      {
        method: 'POST'
      })
      .then(res => res.json())
      .then(() => console.log(`POST to /spray`))
      .catch(err => console.error(`ERROR: ${err}`))
};

export default postManualSpray;
