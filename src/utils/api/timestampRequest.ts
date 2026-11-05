const API_URL = import.meta.env.VITE_API_URL ?? '';

const getTimestamp = async () => {
    let timestamp: string | undefined;

    await fetch(`${API_URL}/timestamp`, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((data) => {
            const date = data['date'];
            const time = data['time'];
            timestamp = `${date} @ ${time}`;
        })
        .catch((err) => console.error(err));

    return timestamp;
};

export default getTimestamp;
