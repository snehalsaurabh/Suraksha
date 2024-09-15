# Problem Statement
According to the recent report published by Ministry of Road Transport and Highways, India witness 1,264 road accidents and 462 deaths every day which means we have a rate of 53 road accidents and 19 deaths on average per hour.

# Solution
Presenting our solution: Suraksha

Our application is a real time motor vehicle accident recognition, monitoring and reporting application which can be utilized by authorities and civilians alike.

# Product Workflow: 
Imagine an accident occurs in front of you. You are a passerby but you don't happen to have the time to deal with this due to your own personal obligations.

You take out your phone, open our mobile application and click a picture. That picture along with the latitude and longitude i.e. the location of the accident is sent to the product backend. 

## Machine Learning
On the backend side, we have two machine learning models which are integrated into one.
The first model utilizes a YoloV9 pre-trained model which has been fine tuned and trained on our custom dataset of over 1200+ images. 

Utilizing that, a severity score for the image is generated indicating the level of attention required towards that certain incident.

A description is generated utilizing the Google Gemini Model which explains the current context of the image.

## Front End
Utilizing the severity score and the description, a post similar to what we see on social media (usually in the form of card) shows up on a feed on both our mobile and web application. 

I will be describing some of the salient features of the post:
1. The image is posted in real time onto the feed which is available to the civilians and the authorities.
2. The location along with the description and the severity score of the accident is posted alongside the image.
3. The post will also contain the status of the accident indicating whether any action has been taken in this regard or not. We have created an admin dashboard for the authorities to use to give updates regarding this.
4. The actions taken by the authorities will be updated in a separate section associated with the post dealing with that accident.
5. There are times when individuals don't want their names to publicized when it comes to incidents like this. To deal with things like this, their names are not posted onto the feed that is showcased to the public but it is shown to the authorities. 

# Use Cases
1. Real Time Accident - Recognition, Detection, Monitoring & Action.
2. Centralized Solution compared to the currently scattered informal reporting application which is Twitter.
3. Better data collection which can be inferred in multiple ways to be utilized by the government. 

# Inspiration
1. Twitter: Twitter is the current informal application which is widely used by the public to report and lodge complaint. The cons are that it is currently very scattered for this use case and highly cluttered.

2. MahaTrafficApp: This application allows citizens of Maharashtra to upload images of vehicles violating traffic regulations which was widely used and abused by the public to claim rewards from the government. Since the reporting application didn't safeguard the identity of the users, this led to a dispute where goons beat up a fellow citizen for reporting their vehicle.

# Analogy
This greatly helps in mitigating the bystander effect. 

Now, what is bystander effect?
The bystander effect is a psychological phenomenon that describes the tendency of people to be less likely to help someone in need when others are present. This can happen in a variety of situations, including emergencies, bullying, or crime.

Our application removes the occurrence of this phenomenon by removing the human involvement. 

# Technical Explanations
1. Why YoloV9?
   Ans:  YOLOv9 marks a significant advancement in real-time object detection, introducing groundbreaking techniques such as Programmable Gradient Information (PGI) and the Generalized Efficient Layer Aggregation Network (GELAN). This model demonstrates remarkable improvements in efficiency, accuracy, and adaptability, setting new benchmarks on the MS COCO dataset.
   
   It has better inference time of about 23 ms on average which is better than most object detection and instance segmentation. 

2. 
# Business Aspect
1. Government Collaborations: We can collaborate with law enforcement agencies, hospitals, and emergency services. Governments can subscribe to use the app as a tool for monitoring accidents and enhancing public safety.
   
   Multiple government departments can make use of this data.
   1. NDRF
   2. Law Enforcement Agencies
   3. Ministry of Road Transport and Highways

2. Corporate Sponsorship: Secure sponsorships from insurance companies, automobile manufacturers, and healthcare organizations to sponsor accident-related information and services on the platform.

3. Premium Services for First Responders: Offer premium features for emergency services that provide advanced notifications, detailed incident tracking, and analytics for accident-prone zones.

4. Data Licensing: Monetize anonymized data by selling it to transportation authorities, road safety research organizations, or city planning departments looking to reduce accident hotspots.
