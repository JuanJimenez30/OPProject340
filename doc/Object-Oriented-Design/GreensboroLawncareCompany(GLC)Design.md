# LocalHarvest Hub - Software Design 

Version 1  
Prepared by Juan Jimenez Mora && Sammy Arreaza\
Greensboro Lawncare Company(GLC) \
Oct 20, 2025

Table of Contents
=================
* [Revision History](#revision-history)
* 1 [Product Overview](#1-product-overview)
* 2 [Use Cases](#2-use-cases)
  * 2.1 [Use Case Model](#21-use-case-model)
  * 2.2 [Use Case Descriptions](#22-use-case-descriptions)
    * 2.2.1 [Actor: Farmer](#221-actor-Provider)
    * 2.2.2 [Actor: Customer](#222-actor-Customer) 
* 3 [UML Class Diagram](#3-uml-class-diagram)
* 4 [Database Schema](#4-database-schema)

## Revision History
| Name | Date    | Reason For Changes  | Version   |
| ---- | ------- | ------------------- | --------- |
|  JJM/SA  |10/8     | Initial Design      |    1      |
|      |         |                     |           |
|      |         |                     |           |

## 1. Product Overview
Greensboro Lawncare Company (GLC) is a simple, comprehensive, easy to use web app with the goal of giving potential customers lawncare services. Provider and customers make use of the centralized platform to meet their needs. 
Provider create and publish services, customers book any available services that they are interested in, either as a one-off or recurring subscription.

## 2. Use Cases
### 2.1 Use Case Model
![Use Case Model](https://github.com/csc340-uncg/f25-team0/blob/main/doc/Object-Oriented-Design/use-case.png)

### 2.2 Use Case Descriptions

#### 2.2.1 Actor: Farmer
##### 2.2.1.1 Sign Up
A farmer can sign up to create their profile with their name, email, password, and phone number. Emails must be unique.
##### 2.2.1.2 Log In
A farmer shall be able to sign in using their registred email and password. After logging in, the farmer shall be directed their dashboard where they see an overview of their farm, boxes and stats.
##### 2.2.1.3 Update Profile
A farmer shall be to modify their profile by going to their profile page. They can change their email, password, and farm.
##### 2.2.1.4 Create Produce Boxes
The farmer shall be able to create a new produce box listing. They would provide a box name, description, and price. This box will be created to be associated with only this farmer and their farm.
##### 2.2.1.4 View Customer Stats
A farmer will be able to view several statistics such as total revenue, total subscribers, and average ratings.

#### 2.2.2 Actor: Customer
##### 2.2.2.1 Sign Up
A customer can sign up to create their profile with their name, email, password, and address.
##### 2.2.2.2 Log In
A customer shall be able to sign in using their registered email and password. After logging in, the customer shall be directed the home screen where tabs are present to either see services, view their cart and leave a feedback.
##### 2.2.2.3 Browse services
A customer shall be able to view available services. They can do this from the services tab. They will also be able to select one service and view more details.
##### 2.2.1.4 Subscribe to service
Upon selecting a service, a customer shall be able to subscribe to the service using a one-click action. The customer will be redirected to their cart and will be able to remove the service from their cart.
##### 2.2.1.5 Review service
A customer may write a review for a service they subscribed to or purchased. They will be able to rate the service based on quality.
##### 2.2.1.6 Update profile
A customer shall be able to modify their profile by going to their profile page. They can change their email, password, and address, phone number, and add a card on their profile.

## 3. UML Class Diagram
![UML Class Diagram](https://github.com/csc340-uncg/f25-team0/blob/main/doc/Object-Oriented-Design/class-diagram.png)
## 4. Database Schema
![UML Class Diagram](https://github.com/JuanJimenez30/OPProject340/blob/main/doc/Object-Oriented-Design/loanEligibilitySystem.UML.png)
