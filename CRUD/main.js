const { MongoClient } = require('mongodb');

const username = `<username>`;
const password = `<password>`;
const clusterName = `<clusterName>`;
const db = `<dbName>`;
const collection = `<collectionName>`;

var singleDocument = {
    name: `Lovely Loft`,
    summary: `A Charming loft in Paris`,
    bedrooms: 1,
    bathrooms: 1,
};

var documentsArray = [
    {
        name: `Huge Loft`,
        summary: `Huge loft with swimmingpool and great view of Glacier`,
        bedrooms: 5,
        bathrooms: 5,
    },
    {
        name: `cozy Loft`,
        summary: `A cozy loft for lovely romantic getaway`,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        name: `THE PentHouse`,
        summary: `Place with maximum area to spend with your friends and have all the fun`,
        bedrooms: 3,
        bathrooms: 3,
    },
];

var conditions = {
    bedrooms: { $gte: 2 },
    bathrooms: { $gte: 2 },
};
var document = { name: `cozy Loft` };

var find = {
    propertyType: { $exists: false },
};
var update = { $set: { propertyType: 'Unknown' } };
var updatedDocument = { bedrooms: 19, bathrooms: 19 };

var deleteOption = { name: `cozy Loft` };
var deleteOptions = { propertyType: `Unknown` };

async function main() {
    const uri = `add your uri`;
    const client = new MongoClient(uri);

    try {
        // connect to the db
        await client.connect();

        // list all the collections available
        await listCollections(client);

        // insert single Document
        await insertSingleDocument(client, singleDocument);

        // insert multiple Documents
        await insertMultipleDocuments(client, documentsArray);

        // read single Document
        await readSingleDocument(client, document);

        // read multiple Document
        await readMultipleDocuments(client, conditions);

        // update single Document
        await updateSingleDocumentByName(client, document, updatedDocument);

        // update multiple Document
        await updateMultipleDocuments(client, find, update);

        // delete single Document
        await deleteSingleDocument(client, deleteOption);

        // delete multiple Document
        await deleteMultipleDocument(client, deleteOptions);
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

/* List the collections available on the mongoDB client*/
async function listCollections(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log('Databases:');
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

/**
 * Insert single document to the collection
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {object} new document that needs to be inserted into the collection
 */
async function insertSingleDocument(client, newDocument) {
    const result = await client.db(db).collection(collection).insertOne(newDocument);
    console.log(`New Document created with the following id: ${result.insertedId}`);
}

/**
 * Insert multiple documents
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_ database
 * @param {Array} array of documents that needs to be inserted into the collection.
 */
async function insertMultipleDocuments(client, documentArray) {
    const result = await client.db(db).collection(collection).insertMany(documentArray);
    console.log(`${result.insertedCount} new Documents are inserted.`);
    console.table(result.insertedIds);
}

/**
 * Update all listings that do not have a property type so they have property_type 'Unknown'
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_ database
 * @param {object} filter you want to use to read single document. Will return single document, even if multiple documents match to the fiter.
 */
async function readSingleDocument(client, document) {
    const result = await client.db(db).collection(collection).findOne(document);

    if (result) {
        console.log(`Found the Document with name ${nameOfDocument}`);
        console.log(result);
    } else {
        console.log(`Could not find the Document with name ${nameOfDocument}`);
    }
}

/**
 * Update all  listings that do not have a property type so they have property_type 'Unknown'
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_ database
 * @param {object} filter you want to use to read single document. Will return all the documents matching.
 */
async function readMultipleDocuments(client, conditions = 0) {
    const cursor = client.db(db).collection(collection).find(conditions).limit(2);
    const result = await cursor.toArray();

    if (result.length > 0) {
        console.log(`Found the Documents with conditions ${conditions}`);
        console.table(result);
    } else {
        console.log(`No Documents found with conditions ${conditions}`);
    }
}

/**
 * Update an Single document with the given name
 * Note: If more than one listing has the same name, only the first listing the database finds will be updated.
 *       It's best to use updateOne when querying on fields that are guaranteed to be unique.
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_ database
 * @param {object} nameOfListing The name of the listing you want to update
 * @param {object} updatedListing An object containing all of the properties to be updated for the given listing
 */
async function updateSingleDocumentByName(client, document, updatedDocument = 0) {
    const result = await client.db(db).collection(collection).updateOne(document, { $set: updatedDocument });

    console.log(`${result.matchedCount} document(s) matched the query`);
    console.log(`${result.modifiedCount} document(s) got updated`);
}

/**
 * Update all  listings that do not have a property type so they have property_type 'Unknown'
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_ database
 * @param {object} find object to get the document matching the object.
 * @param {object} update object to update the document which is matched based on the find object.
 */
async function updateMultipleDocuments(client, find, update) {
    const result = await client.db(db).collection(collection).updateMany(find, update);
    console.log(`${result.matchedCount} document(s) matched the query result`);
    console.log(`${result.modifiedCount} document(s) got updated`);
}

/**
 * Update all  listings that do not have a property type so they have property_type 'Unknown'
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_ database
 * @param {object} delete single document matching the object condition.
 */
async function deleteSingleDocument(client, options = 0) {
    const result = await client.db(db).collection(collection).deleteOne(options);
    console.log(`${result.deletedCount} document(s) was/were deleted`);
}

/**
 * Update all  listings that do not have a property type so they have property_type 'Unknown'
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_ database
 * @param {Object} delete multiple documents matching the object/Array of objects
 */
async function deleteMultipleDocument(client, options) {
    const result = await client.db(db).collection(collection).deleteMany(options);
    console.log(`${result.deletedCount} document(s) was/were deleted`);
}

function main() {
    connectDB().catch(console.error);
}

main();
