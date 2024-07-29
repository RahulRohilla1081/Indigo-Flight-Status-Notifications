# from typing import Union
import pika
from pymongo import MongoClient
from connection import MyDB, url
from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional,Dict
from datetime import datetime
from dateutil import parser
from bson import json_util
import smtplib
import asyncio
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = FastAPI()

clients: Dict[str, WebSocket] = {}

def ensure_collections_exist(mongo_uri, db_name, collection_names):
    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    db = client[db_name]

    def create_collection_if_not_exists(db, collection_name):
        if collection_name not in db.list_collection_names():
            # Create the collection by performing an operation on it
            db[collection_name].insert_one({"dummy": "data"})
            print(f"Collection '{collection_name}' created.")
        else:
            print(f"Collection '{collection_name}' already exists.")

    # Loop through each collection name and ensure it exists
    for collection_name in collection_names:
        create_collection_if_not_exists(db, collection_name)

    # Close the connection
    client.close()
    # client.close()
    
collection_names = [
    "aircrafts",
    "airlines",
    "airports",
    "flights",
    "history",
    "pnrs"
    
    # Add more collection names as needed
]
ensure_collections_exist(url, "indigo", collection_names)

connectionParameters=pika.ConnectionParameters("localhost")
connection =pika.BlockingConnection(connectionParameters)
channel= connection.channel()
channel.queue_declare(queue="delay_email_box")
channel.queue_declare(queue="delay_sms_box")
channel.queue_declare(queue="divert_email_box")
channel.queue_declare(queue="divert_sms_box")
channel.queue_declare(queue="gate_email_box")
channel.queue_declare(queue="gate_sms_box")
channel.queue_declare(queue="terminal_email_box")
channel.queue_declare(queue="terminal_sms_box")
channel.queue_declare(queue="flight_updates_web")
class FlightRequest(BaseModel):
    filter: Optional[dict] = {} 
clients: Dict[str, WebSocket] = {}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Or specify allowed methods
    allow_headers=["*"],  # Or specify allowed headers
)

def serialize_data(data):

    if isinstance(data, dict):
        return {k: serialize_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [serialize_data(i) for i in data]
    elif isinstance(data, datetime):
        return data.isoformat()  # Convert datetime to ISO format string
    else:
        return data

@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    clients[websocket.client] = websocket
    
    try:
        while True:
            # Keep the connection open
            await asyncio.sleep(3600)  # Adjust the sleep duration as needed
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        del clients[websocket.client]


# async def notify_clients(data: dict):
#     print("askdasdhajsbdhjasbdhjasd",data)
#     for client in clients.values():
#         await client.send_json(data)
# async def send_data_to_clients(data: dict):
#     serialized_data = serialize_data(data)
#     await notify_clients(serialized_data)
    
# @app.post("/send-data")
async def send_flight_data_and_notify(flight_id: str):
    print("flight_ida aksbdjhasbdjahs",flight_id)
    flight = list(MyDB.flights.aggregate([
        {"$match": {"flight_id": flight_id}},
    {
        "$lookup": {
            "from": "airports",
            "localField": "departure_airport_id",
            "foreignField": "airport_id",
            "as": "departure_airport_info"
        }
    },
    {"$unwind": "$departure_airport_info"},
    {
        "$project": {
            "_id": 0,
            "airline_id": 1,
            "departure_airport_id": 1,
            "arrival_airport_id": 1,
            "scheduled_departure_time": 1,
            "scheduled_arrival_time": 1,
            "actual_departure_time": 1,
            "actual_arrival_time": 1,
            "flight_id": 1,
            "gate_number": 1,
            "terminal": 1,
            "status": 1,
            "aircraft_id": 1,
            "departure_airport_name": "$departure_airport_info.name",
            "departure_airport_iata_code": "$departure_airport_info.iata_code"
        }
    }
    ]))

    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")

    # Serialize data
    serialized_data = serialize_data(flight)

    print("serialized_data",serialized_data)
    # Notify all WebSocket clients
    for client in clients.values():
        await client.send_json(serialized_data)

@app.post("/trigger-flight-update")
async def trigger_flight_update():
    await send_flight_data_and_notify("AA100")
    return {"status": "Flight data sent to WebSocket clients"}
    
  
@app.post("/flight-status-update")
def get_flightList(request: FlightRequest):
    
    # payload:
#     {"filter": {
# "flight_id":"PNR12345" ,
# "status":"1",
# "actual_departure_time":"",
# "actual_arrival_time":""
  
# }
  
# }
    
    requestBody = request.filter
    print(requestBody)
    filter = {'u_id': requestBody["u_id"]}
    update = {
    '$set': {
        'status': requestBody["status"]
    }}
    result=MyDB.flights.update_one(filter,update)
    # result=list(MyDB.flight.update_one({
    #     "flight_id":"PNR12345" ,
    #     "actual_departure_time":"",
    #     "actual_arrival_time":"",
    #     "gate_number":"",
    #     "terminal":""
    #     }))
    print(result)
    return {"message":"Flight Data updated", "status":200}
    
        

@app.post("/search-pnr")
def read_root(request: FlightRequest):
    requestBody = request.filter
    pipeline = [
        {
            "$match": {
                "pnr_number": requestBody["pnr_number"]
            }
        },
        {
            "$lookup": {
                "from": "flights",
                "localField": "flight_id",
                "foreignField": "flight_id",
                "as": "flight"
            }
        },
        {
            "$unwind": "$flight"
        },
        {
            "$lookup": {
                "from": "airports",
                "localField": "flight.departure_airport_id",
                "foreignField": "airport_id",
                "as": "departure_airport"
            }
        },
        {
            "$unwind": "$departure_airport"
        },
        {
            "$lookup": {
                "from": "airports",
                "localField": "flight.arrival_airport_id",
                "foreignField": "airport_id",
                "as": "arrival_airport"
            }
        },
        {
            "$unwind": "$arrival_airport"
        },
     
         {
            "$lookup": {
                "from": "airlines",
                "localField": "flight.airline_id",
                "foreignField": "airline_id",
                "as": "airline_data"
            }
        },
        {
            "$unwind": "$airline_data"
        },
        {
            "$project": {
                "_id": 0,
                "pnr_number": 1,
                "flight_id": 1,
                "passenger_name": 1,
                "flight": {
                    "flight_number": 1,
                    "departure_airport_id": 1,
                    "scheduled_departure_time": 1,
                    "scheduled_arrival_time": 1,
                    "actual_departure_time": 1,
                    "actual_arrival_time": 1,
                    "gate_number": 1,
                    "terminal": 1,
                },
                "departure_airport": {
                    "airport_id": 1,
                    "name": 1,
                    "city": 1,
                    "country": 1,
                    "iata_code": 1,
                    "icao_code": 1
                },
                "arrival_airport": {
                    "airport_id": 1,
                    "name": 1,
                    "city": 1,
                    "country": 1,
                    "iata_code": 1,
                    "icao_code": 1
                },
               
                "airline_data": {
                    "airline_id": 1,
                    "name": 1,
                    "country": 1,
                    "iata_code": 1,
                    "icao_code": 1,
                 
                },
            }
        }
    ]
    
    result = list(MyDB.pnrs.aggregate(pipeline))
    # finalData:list=[]
    # requestBody = request.filter
    # print(requestBody)
    # mycol = MyDB.pnrs
    # result = mycol.find({
    #     "pnr_number":requestBody["pnr_number"]
    # })
    # for result_object in result:
    #     del result_object['_id'] 
    #     finalData.append(result_object)
    # print(finalData)
    return  result

@app.post("/create-airline")
def read_root(request: FlightRequest):
    
       requestBody = request.filter
       finalData:list=[]
       pipeline = [
    {
        '$project': {
            'airline_id': 1,
            '_id': 0
        }
    },
    {
        '$sort': {
            'airline_id': -1
        }
    },
    {
        '$limit': 1
    }
]
       latest_airline = list(MyDB.airlines.aggregate(pipeline))
       AIRLINE_ID = ""
       if latest_airline:
           latest_airline_id = latest_airline[0]['airline_id']
           ID = int(latest_airline_id[2:]) + 1
           ID = str(ID).zfill(4)
           AIRLINE_ID = "AL" + ID
       else:
           AIRLINE_ID = "AL0001"
       print(AIRLINE_ID)
       MyDB.airlines.insert_one(
           {
            "airline_id":AIRLINE_ID,
            "name":requestBody["name"],
            "country":requestBody["country"],
            "iata_code":requestBody["iata_code"],
            "icao_code":requestBody["icao_code"]}
        )
       
       return {"message":"Airline created", "status":200}


@app.post("/airlines-list")
def get_airlines():
        result = list(MyDB.airlines.aggregate([   {
        '$project': {
            '_id': 0
        }
    },]))
        
        # for result_object in result:
        #     del result_object['_id'] 
        #     finalData.append(result_object)
        # print(finalData)
        return result
    
    
@app.post("/create-airport")
def read_root(request: FlightRequest):
    
       requestBody = request.filter
       finalData:list=[]
       pipeline = [
    {
        '$project': {
            'airport_id': 1,
            '_id': 0
        }
    },
    {
        '$sort': {
            'airport_id': -1
        }
    },
    {
        '$limit': 1
    }
]
       latest_airline = list(MyDB.airports.aggregate(pipeline))
       AIRPLANE_ID = ""
       if latest_airline:
           latest_airline_id = latest_airline[0]['airport_id']
           ID = int(latest_airline_id[2:]) + 1
           ID = str(ID).zfill(4)
           AIRPLANE_ID = "AP" + ID
       else:
           AIRPLANE_ID = "AP0001"
       print(AIRPLANE_ID)
       MyDB.airports.insert_one(
           {
            "airport_id":AIRPLANE_ID,
            "name":requestBody["name"],
            "city":requestBody["city"],
            "country":requestBody["country"],
            "iata_code":requestBody["iata_code"],
            "icao_code":requestBody["icao_code"]}
        )
       
       return {"message":"Airport created", "status":200}  
@app.post("/airports-list")
def get_airports():
         result = list(MyDB.airports.aggregate([   {
        '$project': {
            '_id': 0
        }
    },]))
         return result
    
    
# @app.get("/flight-status-list")
# def get_airlines():
#         finalData:list=[]
#         result = list(MyDB.flight_statuses.find())
#         for result_object in result:
#             del result_object['_id'] 
#             finalData.append(result_object)
#         print(finalData)
#         return finalData
@app.get("/flights-list")
def get_airports():
         result = list(MyDB.flights.aggregate([  
        {
        '$lookup': {
            'from': 'history',
            'localField': 'flight_id',
            'foreignField': 'flight_id',
            'as': 'HISTORY',
            'pipeline': [
                {
                    '$project': {
                        '_id': 0,  # Include the _id field from the history collection
                    }
                }
            ]
        }
    },
    {
        '$lookup': {
            'from': 'airports',
            'localField': 'departure_airport_id',
            'foreignField': 'airport_id',
            'as': 'departure_airport_info'
        }
    },
    {
        '$lookup': {
            'from': 'airports',
            'localField': 'arrival_airport_id',
            'foreignField': 'airport_id',
            'as': 'arrival_airport_info'
        }
    },
    {
        '$lookup': {
            'from': 'aircrafts',
            'localField': 'aircraft_id',
            'foreignField': 'aircraft_id',
            'as': 'aircraft_info'
        }
    },
    {
        '$lookup': {
            'from': 'airlines',
            'localField': 'airline_id',
            'foreignField': 'airline_id',
            'as': 'airline_info'
        }
    },
    {
        '$unwind': '$departure_airport_info'
    },
    {
        '$unwind': '$arrival_airport_info'
    },
    {
        '$unwind': '$aircraft_info'
    },
    {
        '$unwind': '$airline_info'
    },
    {
        '$project': {
            '_id': 0,
            'airline_id': 1,
            'departure_airport_id': 1,
            'arrival_airport_id': 1,
            'scheduled_departure_time': 1,
            'scheduled_arrival_time': 1,
            'actual_departure_time': 1,
            'actual_arrival_time': 1,
            'flight_id': 1,
            'gate_number': 1,
            'terminal': 1,
            'status': 1,
            'aircraft_id': 1,
            'HISTORY': 1,
            'departure_airport_name': '$departure_airport_info.name',
            'departure_airport_iata_code': '$departure_airport_info.iata_code',
            'arrival_airport_name': '$arrival_airport_info.name',
            'arrival_airport_iata_code': '$arrival_airport_info.iata_code',
            'aircraft_name': '$aircraft_info.name',
            'airline_name': '$airline_info.name',
            'airline_iata_code': '$airline_info.iata_code'
        }
    }                                  
        
    ]))
         return result
@app.post("/aircrafts-list")
def get_airports(request: FlightRequest):
        requestBody = request.filter
        result = list(MyDB.aircrafts.aggregate([ 
        {
        "$match": {
        "airline_id": requestBody["airline_id"]
        }
        },
        {
        '$project': {
        '_id': 0
        }
        },]))
        return result
    
@app.post("/create-flight")
def get_airports(request: FlightRequest):
        requestBody = request.filter
        # finalData:list=[]
        pipeline = [
        {
        '$project': {
            'flight_id': 1,
            '_id': 0
        }
        },
        {
        '$sort': {
            'flight_id': -1
        }
        },
        {
        '$limit': 1
        }
        ]
        latest_flight = list(MyDB.flights.aggregate(pipeline))
        FLIGHT_ID = ""
        if latest_flight:
           latest_flight_id = latest_flight[0]['flight_id']
           ID = int(latest_flight_id[2:]) + 1
           ID = str(ID).zfill(4)
           FLIGHT_ID = "AA" + ID
        else:
           FLIGHT_ID = "AA0001"
        print(FLIGHT_ID)
        MyDB.flights.insert_one(
        {
            "flight_id":FLIGHT_ID,
            "airline_id": requestBody["airline_id"],
            "departure_airport_id": requestBody["departure_airport_id"],
            "arrival_airport_id": requestBody["arrival_airport_id"],
            "scheduled_departure_time": parser.parse(requestBody["scheduled_departure_time"]),
            "scheduled_arrival_time":  parser.parse(requestBody["scheduled_arrival_time"]),
            "actual_departure_time": parser.parse(requestBody["scheduled_departure_time"]),
            "actual_arrival_time":  parser.parse(requestBody["scheduled_arrival_time"]),
            "aircraft_id": requestBody["aircraft_id"],
            "gate_number": requestBody["gate_number"],
            "terminal": requestBody["terminal"],
            "status": "2",
        }
        )
        return {"message":"Flight insert"}
@app.post("/update-flight")
def get_airports(request: FlightRequest):
        requestBody = request.filter
        CurrentFlightData = list(MyDB.flights.aggregate([ 
         {
        "$match": {
            "flight_id": requestBody["flight_id"]
        }
    },
    {
        "$lookup": {
            "from": "airports",
            "localField": "departure_airport_id",
            "foreignField": "airport_id",
            "as": "departure_airport"
        }
    },
    {
        "$lookup": {
            "from": "airports",
            "localField": "arrival_airport_id",
            "foreignField": "airport_id",
            "as": "arrival_airport"
        }
    },
    {
        "$project": {
            "_id": 0,
            "flight_id": 1,
            "airline_id": 1,
            "departure_airport_id": 1,
            "arrival_airport_id": 1,
            "scheduled_departure_time": 1,
            "scheduled_arrival_time": 1,
            "actual_departure_time": 1,
            "actual_arrival_time": 1,
            "gate_number": 1,
            "terminal": 1,
            "status": 1,
            "aircraft_id": 1,
            "departure_airport": {"$arrayElemAt": ["$departure_airport", 0]},
            "arrival_airport": {"$arrayElemAt": ["$arrival_airport", 0]}
        }
    }]))
        print("CurrentFlightData",CurrentFlightData)
        CurrentFlightPnrs = list(MyDB.pnrs.aggregate([ 
        {
        "$match": {
        "flight_id": requestBody["flight_id"]
        }
        },
        {
        '$project': {
        '_id': 0
        }
        },]))
        pnr_email_list:list=[]
        pnr_contact_list:list=[]
        unique_emails = {}
        unique_contacts = {}

        for entry in CurrentFlightPnrs:
            email = entry["email_id"]
            if email not in unique_emails:
                unique_emails[email] = entry
            if email not in unique_contacts:
                unique_contacts[email] = entry

        pnr_email_list = list(unique_emails.values())
        pnr_contact_list = list(unique_contacts.values())

        print("CurrentFlightPnrs",pnr_email_list,pnr_contact_list)
        
        
       
        
        # send_email("Test Subject", "This is the body of the email", "rahul.rohilla1081@gmail.com")

        if len(CurrentFlightData)>0:
            CurrentFlightData=CurrentFlightData[0]
        payloadFlight={}
        payloadHistory={}
        def earlier_delayed():
            payloadFlight.update({
                "actual_departure_time":requestBody["actual_departure_time"],
                "actual_arrival_time":requestBody["actual_arrival_time"],
                "status":requestBody["status"]
            })
            payloadHistory.update({
                "actual_departure_time":requestBody["actual_departure_time"],
                "actual_arrival_time":requestBody["actual_arrival_time"],
                "flight_id":requestBody["flight_id"],
                "prev_actual_departure_time":CurrentFlightData["actual_departure_time"],
                "prev_actual_arrival_time":CurrentFlightData["actual_arrival_time"],
                "status":requestBody["status"],
                "prev_status":CurrentFlightData["status"],
            })
            isFlightEarlier= is_date_difference_negative(requestBody["actual_departure_time"],CurrentFlightData["actual_departure_time"],)
            timeDifference= calculate_time_difference(requestBody["actual_departure_time"],CurrentFlightData["actual_departure_time"],)
            # print("flag",isFlightEarlier)
#             MessageBody=""
#             if isFlightEarlier:
#                 MessageBody = (
#                 f"Indigo: Dear flyer, your flight {CurrentFlightData['flight_id']}, "
#                 f"{CurrentFlightData['departure_airport']['iata_code']}-{CurrentFlightData['arrival_airport']['iata_code']}, "
#                 f"{format_time(CurrentFlightData['actual_departure_time'])}-{format_time(CurrentFlightData['actual_arrival_time'])} hrs, "
#                 f"PNR-RAHUL on {format_date(CurrentFlightData['actual_departure_time'])} will now depart {timeDifference} "
#                 f"prior to the original time, due to operational reasons. Departure is now expected to be at "
#                 f"{format_time(requestBody['actual_departure_time'])} hrs. Please reach the airport at least 2 hrs before domestic departures, "
#                 f"and 3 hrs before international departures. Ensure extra time in hand to help you check-in and board your flight. "
#                 f"Regards, Indigo."
# )
#                 # MessageBody="Indigo: Dear flyer, you flight {CurrentFlightData['flight_id']}, {CurrentFlightData['departure_airport_id']}-{CurrentFlightData['arrival_airport_id']}, {format_time(CurrentFlightData['actual_departure_time'])}-{format_time(CurrentFlightData['actual_departure_time'])} hrs, PNR-RAHUL on {format_date(CurrentFlightData['actual_departure_time'])} will now departure {timeDifference} prior to the original time, due to operational reasons, Departure is now expected to be at {format_time(requestBody['actual_departure_time'])} hrs. Please reach the airport at least 2 hrs before domestic departures, and 3 hrs before international departures. Ensure extra time in hand to help you check-in and board your flight. Regards, Indigo."
#             print("MessageBody",MessageBody)
            for recipient in pnr_email_list:
                 if isFlightEarlier:
                    MessageBody = (
                f"Indigo: Dear flyer,\nYour flight {CurrentFlightData['flight_id']}, "
                f"{CurrentFlightData['departure_airport']['iata_code']}-{CurrentFlightData['arrival_airport']['iata_code']}, "
                f"{format_time(CurrentFlightData['actual_departure_time'])}-{format_time(CurrentFlightData['actual_arrival_time'])} hrs, "
                f"{recipient['pnr_number']} on {format_date(CurrentFlightData['actual_departure_time'])} will now depart {timeDifference} "
                f"prior to the original time, due to operational reasons. Departure is now expected to be at "
                f"{format_time(requestBody['actual_departure_time'])} hrs. Please reach the airport at least 2 hrs before domestic departures, "
                f"and 3 hrs before international departures. Ensure extra time in hand to help you check-in and board your flight. "
                f"\nRegards, Indigo."
                )
                 else:
                    MessageBody = (
                f"Indigo: Dear flyer,\nYour flight {CurrentFlightData['flight_id']}, "
                f"{CurrentFlightData['departure_airport']['iata_code']}-{CurrentFlightData['arrival_airport']['iata_code']}, "
                f"{format_time(CurrentFlightData['actual_departure_time'])}-{format_time(CurrentFlightData['actual_arrival_time'])} hrs, "
                f"{recipient['pnr_number']} on {format_date(CurrentFlightData['actual_departure_time'])} is delayed by {timeDifference} "
                f"due to operational reasons. Departure is now expected to be at "
                f"{format_time(requestBody['actual_departure_time'])} hrs. Please reach the airport at least 2 hrs before domestic departures, "
                f"and 3 hrs before international departures. Ensure extra time in hand to help you check-in and board your flight. "
                f"\nRegards, Indigo."
                )
            subject = "Indigo Flight Update"
            print("MessageBody",{"body":MessageBody,"to_email":recipient["email_id"], "subject":subject})
            body = MessageBody
            # message="Hello World!"
            channel.basic_publish(exchange="" ,routing_key="delay_email_box", body=json.dumps({"body":MessageBody,"to_email":recipient["email_id"], "subject":subject}))
            channel.basic_publish(exchange="" ,routing_key="delay_sms_box", body=json.dumps({"body":MessageBody,"contact":recipient["contact"]}))
            # connection.close()
            # success = send_email(subject, body, recipient['email_id'])
            # if not success: 
            #     print(f"Failed to send email to {recipient} after multiple attempts.")
        def diverted():
            
            NewAirportData = list(MyDB.airports.aggregate([ 
            {
            "$match": {
            "airport_id": requestBody["arrival_airport_id"]
            }
            },
            {
            '$project': {
            '_id': 0
            }
            },]))
            if len(NewAirportData)>0:
                NewAirportData=NewAirportData[0]
            print("NewAirportData",NewAirportData)
            payloadFlight.update({
                "arrival_airport_id":requestBody["arrival_airport_id"],
                "status":requestBody["status"]
            })
         
            payloadHistory.update({
                "prev_arrival_airport_id":CurrentFlightData["arrival_airport_id"],
                "arrival_airport_id":requestBody["arrival_airport_id"],
                "prev_status":CurrentFlightData["status"],
                 "flight_id":requestBody["flight_id"],
                "status":requestBody["status"]
            })
            for recipient in pnr_email_list:
                MessageBody = (
                    f"Indigo: Dear flyer,\nYour flight {CurrentFlightData['flight_id']}, "
                    f"{CurrentFlightData['departure_airport']['iata_code']}-{CurrentFlightData['arrival_airport']['iata_code']}, "
                    f"{format_time(CurrentFlightData['actual_departure_time'])}-{format_time(CurrentFlightData['actual_arrival_time'])} hrs, "
                    f"{recipient['pnr_number']} on {format_date(CurrentFlightData['actual_departure_time'])} has been diverted to "
                    f"{NewAirportData['iata_code']} due to operational reasons. The flight will now arrive at {NewAirportData['name']}. "
                    f"Please make the necessary arrangements for your onward journey from the new destination. We apologize for the inconvenience caused. "
                    f"\nRegards, Indigo.")
            subject = "Indigo Flight Update"
            channel.basic_publish(exchange="" ,routing_key="divert_email_box", body=json.dumps({"body":MessageBody,"to_email":recipient["email_id"], "subject":subject}))
            channel.basic_publish(exchange="" ,routing_key="divert_sms_box", body=json.dumps({"body":MessageBody,"contact":recipient["contact"]}))   
            print("MessageBody",MessageBody)
            
        def gate_changed():
            payloadFlight.update({
                "gate_number":requestBody["gate_number"],
                 "flight_id":requestBody["flight_id"],
                "status":requestBody["status"]
            })
            payloadHistory.update({
                "gate_number":requestBody["gate_number"],
                "prev_gate_number":CurrentFlightData["gate_number"],
                "status":requestBody["status"],
                "flight_id":requestBody["flight_id"],
                "prev_status":CurrentFlightData["status"],
                
            })
            for recipient in pnr_email_list:
             MessageBody = (
                f"Indigo: Dear flyer,\nYour flight {CurrentFlightData['flight_id']}, "
                f"{CurrentFlightData['departure_airport']['iata_code']}-{CurrentFlightData['arrival_airport']['iata_code']}, "
                f"{format_time(CurrentFlightData['actual_departure_time'])}-{format_time(CurrentFlightData['actual_arrival_time'])} hrs, "
                f"{recipient['pnr_number']} on {format_date(CurrentFlightData['actual_departure_time'])} has a gate change. "
                f"The new gate is {requestBody['gate_number']}. Please proceed to the new gate for boarding."
                f"We apologize for any inconvenience caused and thank you for your understanding. "
                f"\nRegards, Indigo."
)
            subject = "Indigo Flight Update"
            channel.basic_publish(exchange="" ,routing_key="gate_email_box", body=json.dumps({"body":MessageBody,"to_email":recipient["email_id"], "subject":subject}))
            channel.basic_publish(exchange="" ,routing_key="gate_sms_box", body=json.dumps({"body":MessageBody,"contact":recipient["contact"]}))   
            print("MessageBody",MessageBody)
        def terminal_changed():
            payloadFlight.update({
                "terminal":requestBody["terminal"],
                "status":requestBody["status"]
            })
            payloadHistory.update({
                "terminal":requestBody["terminal"],
                "prev_terminal":CurrentFlightData["terminal"],
                "prev_status":CurrentFlightData["status"],
                "flight_id":requestBody["flight_id"],
                "status":requestBody["status"],
            })
            for recipient in pnr_email_list:
                MessageBody = (
                f"Indigo: Dear flyer,\nYour flight {CurrentFlightData['flight_id']}, "
                f"{CurrentFlightData['departure_airport']['iata_code']}-{CurrentFlightData['arrival_airport']['iata_code']}, "
                f"{format_time(CurrentFlightData['actual_departure_time'])}-{format_time(CurrentFlightData['actual_arrival_time'])} hrs, "
                f"{recipient['pnr_number']} on {format_date(CurrentFlightData['actual_departure_time'])} has a terminal change. "
                f"The new terminal is {requestBody['terminal']}. Please proceed to the new terminal for boarding. "
                f"We apologize for any inconvenience caused and thank you for your understanding. "
                f"\nRegards, Indigo."
                )
            subject = "Indigo: Terminal Changed"
            channel.basic_publish(exchange="" ,routing_key="terminal_email_box", body=json.dumps({"body":MessageBody,"to_email":recipient["email_id"], "subject":subject}))
            channel.basic_publish(exchange="" ,routing_key="terminal_sms_box", body=json.dumps({"body":MessageBody,"contact":recipient["contact"]}))   
            print("MessageBody",MessageBody)
        def default():
            payloadFlight.update({
                "status":requestBody["status"]
            })
            payloadHistory.update({
                "status":requestBody["status"],
                "flight_id":requestBody["flight_id"],
                "prev_status":CurrentFlightData["status"]
            })
        options = {
        '3': earlier_delayed,
        '4': earlier_delayed,
        '13': diverted,
        '17': gate_changed,
        '18': terminal_changed,
  
    }
        options.get(requestBody["status"], default)()
        channel.basic_publish(exchange="" ,routing_key="flight_updates_web", body=json.dumps({"flight_id": requestBody["flight_id"]}))  
        filter = {'flight_id': requestBody["flight_id"]}
        update = {
        '$set': payloadFlight}
        # print(filter,update)
        
        result=MyDB.flights.update_one(filter,update)
        pipeline = [
        {
        '$project': {
            'history_id': 1,
            '_id': 0
        }
        },
        {
        '$sort': {
            'history_id': -1
        }
        },
        {
        '$limit': 1
        }
        ]
        latest_history = list(MyDB.history.aggregate(pipeline))
        # print(latest_flight)
        HISTORY_ID = ""
        if latest_history:
           latest_history_id = latest_history[0]['history_id']
           ID = int(latest_history_id[2:]) + 1
           ID = str(ID).zfill(4)
           HISTORY_ID = "FS" + ID
        else:
           HISTORY_ID = "FS0001"
        # print(latest_flight)
        print(payloadFlight)
        MyDB.history.insert_one(
           {
            "history_id":HISTORY_ID,
            **payloadHistory
            }
        )
        return {"message":"hello"}



def is_date_difference_negative(date1_str, date2_str, date_format="%Y-%m-%dT%H:%M:%S.%fZ"):
    # Convert the string dates to datetime objects
    date1 = datetime.strptime(date1_str, date_format)
    date2 = datetime.strptime(date2_str, date_format)

    # Calculate the difference
    difference = date1 - date2

    # Check if the difference is negative
    return difference.total_seconds() < 0
def calculate_time_difference(date1_str, date2_str, date_format="%Y-%m-%dT%H:%M:%S.%fZ"):
    # Convert the string dates to datetime objects
    date1 = datetime.strptime(date1_str, date_format)
    date2 = datetime.strptime(date2_str, date_format)

    # Calculate the difference
    difference = date1 - date2

    # Calculate the absolute difference in total seconds
    total_seconds = abs(difference.total_seconds())

    # Determine the difference in days, hours, and minutes
    days = total_seconds // (24 * 3600)
    total_seconds %= (24 * 3600)
    hours = total_seconds // 3600
    total_seconds %= 3600
    minutes = total_seconds // 60

    # Create a human-readable difference
    if days > 0:
        return f"{int(days)} day(s)"
    elif hours > 0:
        return f"{int(hours)} hour(s)"
    elif minutes > 0:
        return f"{int(minutes)} minute(s)"
    else:
        return "a minute"
def format_time(date_str):
    if date_str:
        # Parse the date string into a datetime object
        selected_date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        
        # Get hours and minutes, and format them to ensure they are 2 digits
        hours = f"{selected_date.hour:02}"
        minutes = f"{selected_date.minute:02}"
        
        print("asdasdasdasd", f"{hours}:{minutes}")
        return f"{hours}:{minutes}"
def format_date(date_str):
    # Parse the date string into a datetime object
    selected_date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    # Format the date into "day Month year"
    formatted_date = selected_date.strftime("%d %B %Y")
    
    return formatted_date
# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}