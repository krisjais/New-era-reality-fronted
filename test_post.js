async function testPost() {
  const res = await fetch('http://localhost:3001/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'test', phone: '123', subject: 'test', message: 'hello', leadType: 'contact_form' })
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
}
testPost();
