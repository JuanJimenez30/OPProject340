# Software Requirements Specification
## For <OPProject340>

Version 0.1  
Prepared by <Sammy Arreaza, Juan Jimenez>  
<Greensboro Lawncare Company (GLC)>  
<date 9-14-25> 

Table of Contents
=================
* [Revision History](#revision-history)
* 1 [Introduction](#1-introduction)
  * 1.1 [Document Purpose](#11-document-purpose)
  * 1.2 [Product Scope](#12-product-scope)
  * 1.3 [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  * 1.4 [References](#14-references)
  * 1.5 [Document Overview](#15-document-overview)
* 2 [Product Overview](#2-product-overview)
  * 2.1 [Product Functions](#21-product-functions)
  * 2.2 [Product Constraints](#22-product-constraints)
  * 2.3 [User Characteristics](#23-user-characteristics)
  * 2.4 [Assumptions and Dependencies](#24-assumptions-and-dependencies)
* 3 [Requirements](#3-requirements)
  * 3.1 [Functional Requirements](#31-functional-requirements)
    * 3.1.1 [User Interfaces](#311-user-interfaces)
    * 3.1.2 [Hardware Interfaces](#312-hardware-interfaces)
    * 3.1.3 [Software Interfaces](#313-software-interfaces)
  * 3.2 [Non-Functional Requirements](#32-non-functional-requirements)
    * 3.2.1 [Performance](#321-performance)
    * 3.2.2 [Security](#322-security)
    * 3.2.3 [Reliability](#323-reliability)
    * 3.2.4 [Availability](#324-availability)
    * 3.2.5 [Compliance](#325-compliance)
    * 3.2.6 [Cost](#326-cost)
    * 3.2.7 [Deadline](#327-deadline)

## Revision History
| Name       | Date    | Reason For Changes  | Version   |
| Juan/sammy | ------- | Initial SRS         |    1.0    |
|            |         |                     |           |
|            |         |                     |           |
|            |         |                     |           |

## 1. Introduction

### 1.1 Document Purpose
Describe the purpose of the SRS and its intended audience.

### 1.2 Product Scope
Identify the product whose software requirements are specified in this document, including the revision or release number. Explain what the product that is covered by this SRS will do, particularly if this SRS describes only part of the system or a single subsystem. 
Provide a short description of the software being specified and its purpose, including relevant benefits, objectives, and goals. Relate the software to corporate goals or business strategies. If a separate vision and scope document is available, refer to it rather than duplicating its contents here.

### 1.3 Definitions, Acronyms and Abbreviations                                                                                                                                                                          |

### 1.4 References
List any other documents or Web addresses to which this SRS refers. These may include user interface style guides, contracts, standards, system requirements specifications, use case documents, or a vision and scope document. Provide enough information so that the reader could access a copy of each reference, including title, author, version number, date, and source or location.

### 1.5 Document Overview
Describe what the rest of the document contains and how it is organized.

## 2. Product Overview
Greensboro Lawncare Company (GLC) is a web-based platform designed to help consumers select from lawn care services that we offer. Customers can browse lawn care services, view available dates/times, and leave reviews based on service experience. Provider manage services, update service schedules, and track customer reviews. The system supports multiple user roles including customers and providers; each with tailored services to ensure a vibrant, transparent, and community-driven service provider for lawn care.

### 2.1 Product Functions
Greensboro Lawncare Company (GLC) enables providers to create and customize the lawn care services they offer. Providers can manage service schedules, update availability, and track customer reviews. Customers can browse and compare services, schedule appointments, and manage their bookings from personalized shopping carts.

### 2.2 Product Constraints
At this point, the program will only run on a computer that has JDK-23 installed. The team has a prototype deadline on September 25th. Hopefully the full scope of the project is realized, which can lead to functionality cuts. The current plan is to use a free version of a data base to store user information. 
  
### 2.3 User Characteristics
Our users should not be expected to know how to use a computer only web-based platforms. As long as users know how to select from the various services and choose a day and time they are interested in, they should be comfortable within several uses of the application.

### 2.4 Assumptions and Dependencies
We will be using Java and RestAPI to connect to external APIs and developed with VS Code. The application will also use an external schedule API that will help customers choose from various days and time frames that are available.

## 3. Requirements

### 3.1 Functional Requirements 

- FR0: The system will allow customer to create log-in/create account.
- FR1: The system shall allow customer to select a lawn care service.
- FR2: The system shall allow customer to select a time frame (Day & Time).
- FR3: The system shall allow customer to have a checkout option and enter card information.
- FR4: The system shall allow customer to enter reviews for services.
- FR5: The system shall allow customer to change/cancel service.
- FR6: The system shall allow customer to view cart. 
- FR7: The system shall allow provider to create/delete services.
- FR8: The system shall allow provider to log-in/create account.
- FR9: The system shall allow provider to create/delete timeframes (day/time) for services.
- FR10: The system shall allow provider to reply to reviews.
- FR11: The system shall allow provider to view customer information.
- FR12: The system shall allow provider to accept/deny requested services of a customer.


#### 3.1.1 User interfaces
Web pages using HTML, CSS, and JavaScript.

#### 3.1.2 Hardware interfaces
Devices that have web browser capabilities.

#### 3.1.3 Software interfaces
- Java jdk 23
- MySQL
- SpringBoot 3.4.5

### 3.2 Non Functional Requirements 

#### 3.2.1 Performance
- NFR0: The Greensboro Lawncare Company (GLC) Hub system will consume less than 200 MB of memory
- NFR1: The novice user will be able to select and book services in less than 6 or 7 minutes.
- NFR2: The expert user will be able to select and book services in less than 3 minutes.

#### 3.2.2 Security
Specify any requirements regarding security or privacy issues surrounding use of the product or protection of the data used or created by the product. Define any user identity authentication requirements. Refer to any external policies or regulations containing security issues that affect the product. Define any security or privacy certifications that must be satisfied.

#### 3.2.3 Reliability
Specify the factors required to establish the required reliability of the software system at time of delivery.

#### 3.2.4 Availability
Specify the factors required to guarantee a defined availability level for the entire system such as checkpoint, recovery, and restart.

#### 3.2.5 Compliance
Specify the requirements derived from existing standards or regulations

#### 3.2.6 Cost
Specify monetary cost of the software product.

#### 3.2.7 Deadline
Specify schedule for delivery of the software product. 
