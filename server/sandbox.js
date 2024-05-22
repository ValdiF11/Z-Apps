const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://firstyanto7:os2QvXbmcKx9797i@hacktiv8.kopmhw4.mongodb.net/?retryWrites=true&w=majority&appName=hacktiv8";
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the "insertDB" database and access its "haiku" collection
    const database = client.db("z_apps");
    const users = database.collection("users");

    // Create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    };
    // Insert the defined document into the "users" collection
    const result = await users.insertOne(doc);

    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}
// Run the function and handle any errors
run().catch(console.dir);
