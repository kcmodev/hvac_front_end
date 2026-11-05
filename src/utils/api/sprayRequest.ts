const API_URL = import.meta.env.VITE_API_URL ?? '';

const postManualSpray = async () => {
    await fetch(`${API_URL}/spray`, {
        method: 'POST',
    })
        .then((res) => res.json())
        .then(() => console.log(`POST to /spray`))
        .catch((err) => console.error(`ERROR: ${err}`));
};

export default postManualSpray;
