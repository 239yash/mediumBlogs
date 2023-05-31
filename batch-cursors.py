# We are using pymongo package here
import pymongo as pmg

# Parameters required for fetching documents -

# Projection - Why to import whole document, We'll import only required fields.
projection = {"firstName" : True, "lastName" : True, "emailId": True, "_id" : False}
# Query parameter, for different conditions.
query = {}
# Database name
dbName = 'userDatabase'
# Collection name
collectionName = 'users'
# Enter your MongoDB cluster URL
mongoUrl = ""

# Function to connect to our MongoDB Cluster
def mongoConnection():
    try:
     # Fetching client using pymongo
        client = pmg.MongoClient(mongoUrl)
        # Holding our database
        mydatabase = client[dbName]
        return mydatabase
    except Exception as e:
        print("Error occured while connecting to database!")
        return False

def iteratingFunction():
    try:
        db = mongoConnection()
        # Fetching the collection
        collection = db[collectionName]
        batch = collection.find(query = query, projection = projection, batch_size = 1000)
        
        for doc in batch:
         print(doc["emailId"])

    except Exception as e:
     print("Error occured!")

iteratingFunction()