# Overview of Flight Status and Notifications: IndiGo

### Architecture: Event-Driven Architecture
### Backend: Python
### Frontend: React JS
### Message Broker: RabbitMQ
### SMS Provider: Twilio
### Real-Time data-sync: Web Sockets
### Database: MongoDB

### Download the detailed view from below URL
`https://drive.google.com/drive/folders/10hKioogHznR5k97bVcqOw4OTBbVkTvNw?usp=share_link`



## Tech Stack
### Backend: 
`Python` (Utilized frameworks and libraries for efficient event handling and real-time processing.)
### Frontend: 
`React JS` (Built a user-friendly interface for real-time flight tracking.)
### Message Broker: 
`RabbitMQ` (Managed event queues for notifications, ensuring reliability and scalability.)
### SMS Notification: 
`Twilio` integrated as the SMS provider. Ensured reliable and timely delivery of SMS notifications to end-users.
### Web Sockets: 
Enabled real-time communication between the backend and frontend applications.
### Database: 
`MongoDB` Managed complex data efficiently, supporting real-time queries and updates

## Business Benefits
### Real-Time Tracking: 
Users can track flights in `real-time`, enhancing the `user experience`.

### Efficient Notifications: 
Ensured timely delivery of critical notifications through `RabbitMQ`.

### Scalability: 
The system can grow with the business needs, handling more users and events without sacrificing performance.
### Data Integrity:
Prevented data loss by queuing messages and ensuring `reliable delivery`.

## Summary
Developed a robust flight tracking system to provide real-time flight status updates and notifications to
passengers. The system provides live updates on flight positions, statuses, and estimated arrival/departure times etc. It displays real-time flight information on an user-friendly dashboard, allowing users to track flights visually. 
Advanced Search and Filtering enables users to search for flights by `PNR number`.
Focused on `scalability`, `reliability`, and `real-time data synchronization` to provide an exceptional user experience.
Please find PPT and pdf below
[Indigo.pdf](https://github.com/user-attachments/files/16424469/Indigo.pdf)
[Indigo.pptx](https://github.com/user-attachments/files/16425145/Indigo.pptx)
Please find details overview of project
[Overview.docx](https://github.com/user-attachments/files/16428444/Overview.docx)

In this React.js business application, following screens are there:  

`Dashboard`

`Search PNR`

`Flights create, update(Admin)`  

`Aircrafts,(Admin)`  

`Airports,(Admin)`  

 

`Dashboard`

In dashboard passengers can see information i.e. STD (Scheduled Time of Departure), Airline, Flight no., destination, Status in real time. Any update in any flight data by admin leads to real time update of the dashboard screen data. 

`Search PNR` 

From the navigator panel on Left Hand Side, Click on Search PNR.  
In search PNR screen, passengers can enter their PNR number in search input box to get the itinerary data like Departure airport, destination airport, Flight timing, gate number, flight number, terminal. The details are generated for each passenger travelling under that PNR. 

`Flight Create, update – Admin Access:`  

Click on flights on navigator panel. 

To access this screen, ID and password is required. 

After login, Admin will able to view the flights details in tabular format, in which there will be flight details like scheduled timing,  actual timing, gate number, terminal, airports details, status.  

Admin can create new flight by selecting the aircraft, timings of departure and arrival, departure airport and destination airport, gate number and terminal.  
On every flight data there are buttons to update the flight details, like, timings, status changes, gate or terminal changes.  

Every time flight updated, a log is generated and can be viewed by clicking on the history button. All previous data and new data is listed in history in tabular format.  

Also this action will trigger the event and notification will be sent to passengers via email as well as SMS in case of any update in flight delays, flight early departure, gate or terminal changes, diverted etc 

But admin can change flight status like Boarding, Departed, In Air, Landed etc. for internal purpose.  

`Aircrafts:`  

Admin can add new aircrafts data if indigo adds new aircrafts in the fleet.  

`Airports:`  

Admin can add/manage the airports details like airport name, IATA Code, ICAO Code, City, Country.  

## Summary of Architecture: 

I used an `event-driven architecture` approach to make the application `scalable`, `reliable`, `resilient`, and capable of `real-time processing`.

I implemented Role-Based Access Control (RBAC) to separate the admin screens from the passenger screens. RBAC secures admin access with passwords while allowing anyone to search and view flight data.

In this React.js business application, I created screens to manage flight delays, gate changes, terminal changes, and flight diversions. Whenever an admin updates the flight, an event is generated. That event is pushed into a queue (RabbitMQ) and then consumed, with notifications sent to passengers.

To achieve this, I used RabbitMQ. I created an event producer (React JS website) and a consumer (RabbitMQ Consumer) as separate services for notifications (Email and SMS). All flight changes are pushed to a queue in RabbitMQ, and from that queue, the consumer sends notifications to passengers. This approach helps in case of server downtime, ensuring no notification data is lost. Whenever our server is back up, email and SMS notifications are sent to passengers.

Additionally, this triggers the WebSocket, which sends the updated flight details to the dashboard in real-time.

I wrote the backend in Python and used MongoDB as the database for flexibility and scalability. I created a Python server to provide REST APIs and implemented WebSockets using the FastAPI package.

I used the pymongo package to query MongoDB for data such as flight lists, creating flight data, and updating flight data.

I used Twilio to send SMS notifications and the smtplib package to send email notifications from a support email address to passengers.

## Case Study Summary:

Admin logs in and updates flight data, which is reflected in real-time on the dashboard.

For every update in flight records, respective passengers receive automatic notifications through email and SMS.

Even if the server stops during this process, the notification data remains in the RabbitMQ queue, and the process is completed immediately when the server restarts. This ensures that no processes are lost, and passengers receive timely notifications without fail. 



