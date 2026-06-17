const { MongoClient } = require('mongodb');

async function checkCollections() {
  const client = new MongoClient('mongodb://localhost:27017/new-era-reality');
  await client.connect();
  const dbNative = client.db();
  
  const cols = await dbNative.listCollections().toArray();
  console.log("Collections:", cols.map(c => c.name));
  
  const leads = await dbNative.collection('leads').find().toArray();
  console.log("leads count:", leads.length);
  
  const Lead = await dbNative.collection('Lead').find().toArray();
  console.log("Lead count:", Lead.length);
  
  process.exit(0);
}

checkCollections();
