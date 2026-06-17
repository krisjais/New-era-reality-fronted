const { MongoClient, ObjectId } = require('mongodb');

async function checkLeads() {
  const client = new MongoClient('mongodb://localhost:27017/new-era-reality');
  await client.connect();
  const dbNative = client.db();
  
  const leads = await dbNative.collection('Lead').find().toArray();
  for (let lead of leads) {
    console.log("ID:", lead._id, "Is ObjectId?", lead._id instanceof ObjectId, "Type:", typeof lead._id);
  }
  
  process.exit(0);
}

checkLeads();
