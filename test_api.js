
async function test() {
    const url = 'http://localhost:4000/api/team';
    try {
        const res = await fetch(url);
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data:', JSON.stringify(data).slice(0, 100));
    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
}
test();
