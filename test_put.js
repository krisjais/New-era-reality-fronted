async function testPut() {
  const res = await fetch('http://localhost:3001/api/leads/6a316764a17677dbaabea4be', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'contacted' })
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
}
testPut();
