import pymongo
# url="mongodb+srv://rahulrohilla1081:Rahul1234@cluster0.jwsmyb8.mongodb.net/?retryWrites=true&w=majority"
# url="mongodb+srv://rahulrohilla1081:Rahul1234@cluster0.7fm499v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
url = "mongodb://0.0.0.0:27017";
MongoDBConnection = pymongo.MongoClient(url)
MyDB = MongoDBConnection.indigo