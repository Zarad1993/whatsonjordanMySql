Project: whatsonjordan
Description:
to list all the events that focuses on youth ages from 5 to 17 years old.
three parts of the prject:
1. public: list all the available events, if the user intrested on one of the events he/she can register for the event 				if they have already registered in the application, otherwise they need to register by email, password, 				phone (stag1 one, for stage two we could add the location also).

2. for the logged in users: shows a welcome page and the events that particular user register for it ( on stage two: 		add a folowing up procedure and the reminder about the events dates).

3. for an events makers: 
	3-1 if the events maker is new he/she should register first and fill the details of them as email password contact 		information and other important details.
	3-2 if the events maker was already registered he/she could login with the username and password.
		after the maker logged in he could go to his/her special page part of it is the profile sector that allows them to edit thier contacts and other things. another part is for the announced list of events, another part for the list of the expired events that they could reannounce in the future to avoide creating events from scratch and to make life easy.




Todolist:
- [x] Create the home page
- [x] Add navbar
- [x] Create user login
- [x] Create user register
- [x] Create user profile page
- [x] Create login maker
- [x] Create register maker
- [x] Create maker profile page
- [x] Create events page
- [x] view events related to each logged in maker on the profile page
- [x] Create add event page for the logged in maker after he/she logged in

29/mar/2018
- [x] Edit particular event.
- [x] Remove Event from event list by event maker.

29/mar/2018
- [x] Add details button to each event lead to the event page details.
- [x] Create event details page.
- [x] Add register button on the event details page.
- [x] If user dosen't logged in the promt user to login or register.
- [x] User register for particular event from events list.
- [x] show the registered events on the user profile page.
- [x] remove previously registered event from user event list.

??/Apr/2018
- [x] connect to mongoDB
- [x] refactor events and makers to mongoDB and mongoose

20/Apr/2018
- [x] refactor user to be on mongoDB and mongoose.


22/Apr/2018
- [x] fix the registration for event to check first if user already register with the event before.


23/Apr/2018
- [x] adding passport to user and maker

30/Apr/2018
- [x] remove the user's id and maker's id from the browser url for more secure.

03/May/2018
- [x] encrypt the password for user and maker with salt and hash.

04/May/2018
- [x] add google authentication.

06/May/2018
- [x] deploy on heroku and connect the database via mLab as addons of heroku.

07/May/2018
- [x] add profile image.

09/May/2018
- [x] rebuild the database to be just one collection for users with multi tags [user, maker, admin, superAdmin]. 
- [x] rebuild the login system to be just one login page if the tag is user go to user maker admin profile respectfuly. 
- [x] the admin decided if the user is a maker by add a tag maker to the record.

- [x] add the validity for each event and add filter to show just the valid events (add events validity for registration on database). 
- [x] redirect the registered user or maker direct to the profile not to the login page.



- [x] changing the database and the logic:
	- [x] register template
	- [x] registerController
	- [x] user service client
	- [x] user service server
	- [x] user model
	- [x] user schema
	- [x] passport
	- [x] server
	- [x] database


- [x] add the admin page to manage:
	[x] a. the registration of the makers.
	[x] b. confirm the publish of the event after added by the maker.
	
 - [x] the maker can make payment for each user and to show the balance.

 - [x] add the payment for each user managed by the maker.

 - [x] filter events by the starting date greater than today still not expired
 - [x] now we send email to user directly after register with image logo
 - [x] upload profile image with multer to folder
 - [x] upload / display profile image to/from AWS S3 bucket
 - [x] reset password with email confirmation
 - [x] The ability of update user profile
 - [x] add member to event then count on the makers events list
 - [x] maker can add payments for user event
 - [x] readd the ability of updating uploading profile image
 - [x] calculate payment details on maker view for each member
 - [x] add statement of account for each event on maker view
 - [x] fix the location after update profile and add price to new event
 - [x] maker can do payments and list payments details and take members attendance
 - [x] show payments and attended details on user profile
 - [x] create event details day by day calculating the days of the programs based on the days per week

12/July/2018
 - [x] when maker update the event details he can also change the dates of the event.
 - [x] maker can change the days per week.
 - [x] copy the program details for old days and put them in the new days.
 - [x] change the tag of approved and special untill the admin confirm the update.


13/July/2018
 - [x] show the upcomming event details from the (event details day by day) for registered members on their profile.

15/July/2018
 - [x] use mapbox Maps as an alternative to google maps.
 - [x] show markers on Map.
 - [x] zoome the map to show all the available markers.

18/July/2018
 - [x] show the popup on marker when mouse enter and hide it when leave.
 - [x] change the marker symbol to private one.

19/July/2018
 - [x] The carousel now is sliding automatically
 - [x] work on the attendance not keep add attendance to the array on the database but filter the attendance if the event is the same and the date is the same just update the attendance not add new on.

20/July/2018
 - [x] Fix the error message of incorrect credential login.

21/July/2018
 - [x] when update the event by maker the days will displayed so if not updated will still the same.

22/July/2018
 - [x] add option when creating new event to have the location from current location or from the map

23/July/2018
 - [x] Member can write feedback shown on member profile page and maker event details page.

24/July/2018
 - [] Price based on daily price to calculate the registered days then the start and end time event fixed.

28/July/2018
 - [x] event maker can give discount for particular user.
 - [x] the discount types are:
 	1. Family: for family members give 10%.
 			   with a discount tag for the family members calculated with father name and last name with the calculated hour+day+month+year (AwsAhmed02862018);
 	2. Group: for group members like fiends give 10%. 
 			  with a discount tag for the group members the maker should give a special name for the group name should added before the calculated tag that calculated like the family tag.
 	3. Special: with four types:
	 		  special25: give 25% discount, the discount tag will be special25.
	 		  special50: give 50% discount, the discount tag will be special50.
	 		  special75: give 75% discount, the discount tag will be special75.
	 		  special100: give 100% discount, the discount tag will be special100.
 - [x] Payment:
 			1. select the payment type:
 				DownPayment: The payment amount show the minimum payment calculated as a session price.
 				Weekly: The payment amount show the weekly payment calculated as event price / 4.
 				Full: The payment amount show the balance of the user (the remaining amount).
 - [x] The details now showing:
 			Total payments
			Balance
			Event price
			Discount type
			Discount Tag
 - [x] The event details now showing: 
			Event Summary:
				Total of members
				Total Income from the event
				Total of Payments
				Event payments balance

06/Aug/2018
 - [x] huge amendment on the schema that now every user have a userEventParameters that collect each event main parameter, calculate the price for each user based on the discount and the event days for the particular user if he/she register after the event started, collect the attendance, payments, feedbacks, freezeDays.
 - [x] maker have to give discount to calculate userEventParameters if no discount then choose "No discount".
 - [x] the payment calculated based on user discount, eventDays for user.
 - [x] the details show the discount type and tag also.
 - [x] the attendance now in seperate modal, and could taken multiple times throught the day, and it shows the totals.
 - [x] freeze memberShip for each user, the modal will show show the days from today to as a checkbox to select the days the user want to freeze, after submit the user could not freeze again as it once per the event, if he try to do that then the checkboxes will be disabled, for the user that had froze days they will shown on bottomn of the modal.
 - [x] the feedback is workinng just fine.



Payment module:
	price calculation:
		. devide event price on days of the event.
		. select the payment type: weekly then multiply price by days per week or full payment then multiply by days of the event.
	Discount procedure:
		. with first payment maker add tag for discount:
			- siblings tag by adding father name as the tag then this tag affect the price by multiply by 0.9 to discount 10%.
			- friends tag by adding group tag name from a list [champs, legends, lions, winners, ...] then this tag affect the price by multiply by 0.9 to discount 10%.
			- special discount price applied by the admin of the event with password field and dicount amount field this amount multiplied by the price.



Todo list:
-------------

- [] check the barcode reader if it doable.

- [] Admin controll user type (to create the maker).

- [] add controll to maker to decide taking the member special discount (when make the payment and the balance --> check if there is a discount code putted by the maker on the members list).

- [] count registered members just if they hav a tag 'paid' which it released when make a payment.

- [] create a list of members they registered online removed from the list after pay and registered them on the event registered members.

- [] work on the problem of still access event details by maker although maker signed out?

- [] profile details about each coach in event.


User actions from starting register for particular evet:
	- User register for event
	- the {eventParams} added to user.[userEventParameters] in user database containing:
        eventId: String,
        discountType: String,
        discountTag: String,
        percentage: Number,
        eventDays: [String],
        discountedEventPrice: Number,
        normalEventPrice: Number,
        freezeDays: [String],
        payments: [{date: Date, amount: Number}],
        attendedDays: [{date: String,attended: Boolean}],
        feedbacks: [{date: Date, eventName: String, feedback: String}]
	- maker list the registered members
	- when user ask maker to officially register by pay for the event the maker steps are:
		1. decide if he want to give a discount?
			if yes:
				1. giveADiscount() function will alter.
				2. loop a user.userEventParameters search for the eventId, if found check:
					user.userEventParameters.discountType
					if null then update the discount type, tag with values
					else send error.
			if No:
				1. select no discount to fill the userEventParameters with data.
		2. Pay:
			loop a user.userEventParameters search for the eventId, if found:
				1. loop user.userEventParameters.payments
				2. select the payment date and type.
				3. the amount will appear in the textBox below.
				4. submit.
	- datails show user's payments and the totals with the discount type and tag.
	- maker can tage the attendance for the date throught the same day multiple times even after submit, and the modal will show to totals in the bottomn.
	- Freeze membership:
		1. [x] maker can give a freeze for user membership once through the event by selecting the days the user want to freeze, if the user already had a froze days then the checkboxes of the days will be disabled and note displayed that the user already had a froze days, the froze days appear on the bottomn of the modal.
		2. [x] Store the froze members on event frozeMembers Array, and on the userEventParameters.
		3. [x] Create a button on the event list for the maker to ReCreate an event, when clicked call the reCreateEvent() function that first step on it is copying the event data and store it in temporary object named reNewedEvent.
		4. [x] remove unnecessary properties from the temporary object: _id, created, makerId, special, __v, approved, registeredMembers, discountedMembers, expenses.
		5. [x] redirect to the page of creating new event with the modified object (reNewedEvent) to fill the form from it.
		6. [x] add originalEventId to the event object to indicate that this is renewed event and the removal of the frozen members will be based on it to solve the problem of on which event the user get back the frozen dates from.
		7. [x] next time when user register for the same event recognised by originalEventId if the user have froze days when maker choose the discount type to create the userEventParameters loop on the userEventParameters searching for the originalEventId if the user had frozeDays, if yes; calculate the event days will be with steps:
				starting from the day that the user register.
				calculate the discounted price daily and full price.
				calculate the froze days price by * daily price then deduct the amount from the result 
				remove the froze days from the new event and from the userEventParameters.
	- [x] creat additional modal to collect expenses by date select the category(salary, hospitality, rental fees, misc) then textbox for details.
	- [x] create filtered totals to calculate each expense category.
	- [x] create additional button and modal for the attendance history for each member.
	- [x] Admin has the ability to choose which comments to be published on the main page.
	- [x] show the details of the price breakdown to include:
		original price
		discounte type
		discounted price
		event days
		daily price
		registered days
		froze days
		froze days amount
		total event price
	- [ ] On maker event details page show just paid members and put checkbox to show the unpaid members to make them pay.
Notes:
06/Aug/2018
	[x] group and family tag to be shown on the discount modal.
	[x] delete the froze days from the next event.
	[x] create additional button and modal for the attendance history for each member.
	[x] creat additional modal to collect expenses by date select the category(salary, hospitality, rental fees) then textbox for details.
	[x]Admin decided to publish the comments on main page.
	- create memberShip serial number (today.getFullYear()+serial) Year0001 20180001 continiouse for all members.
	- report for families and groups for maker tab for family other for groups with members.
	- export expenses to excel.
	- fix the Event Summary in maker event details to show totals right at startup.
Important:
 [x] give the maker option to create a new event from previouse one data so the name will be the same
 - User with froze membership should appear disabled on attendance







Notes Oct 22

Registration form.
	1. create a link for the parents registrations.
	2. filled by the registerer employee.
	Registration form:
		[x] player name: first, middle, last.
		[x] DOB
		[x] Gender
		[x] Nationality
		[x] School name
		[x] Grade
		Home address (Map)
		Parent / Guardian name: first, middle, last.
		Mobile No. with International code.
		Secondary / emergency mobile No.
		[x] Email
		Please list those people including in addition to parents / guardians who are permitted to pick your child.
		Name: first, middle, last.
		Phone: 
		Please list any medical problems including any requireing maintinance medication (i.e. Diabetic, Asthma, Seizures)
		Child photo


Notes on Oct 30 2018:
	To add the point with star
	Each event has the following data:
		Name 
		Category 
		Subcategory 
		Details 
		Starting date
		Expiry date
		Days per week
		Price
		Images: 1200x300 ---- 750x450
		Address
		Location on map
		* Session time from: to:
		* Category age group


[x] create new page copy from allEvents tweaked the it will accept the maker id on the href like the evenId when click on event to filter the events and show just the specific maker events.



[x] add the terms and conditions to the event details and show them on the registration form
[x] add ages from to fields in the schema and then showed in the event details
[x] the filter will work on the logged user age automatically. each user see different events based on the DOB.
[x] create custom filter for the age accepted by events




[] its the time to test by:
	[] ceate new event maker
	[] create new event for three days and make it like real one
	[] create members with real email (three or more members)
	[] let the members register for the event
	[] manage the event for all the event time
	[] work on all the event options (discount, attendance, feedbak, renew the event, ..... etc)



13 NOV 2018
	[] check the barcode reader if it doable.
	[] check the show just the paid members on maker event details view not working correct when chose the paid then turn the on off button it gives not all members but the unpaid members instead it should show all the members.
	[] checkbox on members list in the maker view to check if the member receive the outfit with the date.
	[] system documentation 
	[] schedual to be shown on the maker view list to 

	
25 November 2018
	Albakry Notes:

MySql
sequelize
EC2, RDS: how to deploy on EC2, deploy Node on ec2


Docker:
- Install Docker on your computer
- Setup docker with mysql. Run image and connect to it with your computer

Sequelpro:
- Install SequelPro on your computer [done]
- Connect to the Database from sequelpro [done]






working with sql:
	[x] create and connect to the mysql database whatsonjordan.
	[x] create users through the signup form.
	[x] login registered user.
	[x] create the userType table and connect it to users table (1:1)
	[x] create the contact table and connect it to the users table (1:1)
	[x] create the address table and connect it to the users table (1:1)
	[x] create the nationality table and connect it to the users table (1:1)
	[x] create the school table and connect it to the users table (1:1)
	[x] create the grade table and connect it to the users table (1:1)
	[x] add resetPasswordToken and resetPasswordExpires column to users table;
	[x] create the events table	
	[x] create the ageGroup table and connect it to the events table (1:1)
	[x] create the categories table and connect it to the events table (1:1)

	[ ] create event by maker
	[ ] fetch events from the database
	[ ] to add the ability to the admin to change the user_type (1 user, 2 maker, 3 admin)


remaining from user:
	events: 
	registeredEventsList: 
	userEventParameters: [
        {
            _id: false,
            eventId: String,
            discountType: String,
            discountTag: String,
            percentage: Number,
            eventDays: [String],
            discountedEventPrice: Number,
            normalEventPrice: Number,
            freezeDays: [String],
            payments: [
            	{
            		_id: false,
            		date: Date,
            		amount: Number
            	}
            ],
            attendedDays: [
            	{
            		_id: false,
            		date: String,
            		attended: Boolean	
            	}
            ],
            feedbacks: [
            	{
            		_id: false,
            		date: Date,
            		eventName: String,
            		feedback: String,
                    userId: String,
                    approved: Boolean
            	}
            ]
        }

	],
	google: {
        id: String,
        token: String
    },
    medical: {
    	medicalIssues: String,
    	problemDetails: String 
    },
    payments: [],
    attendedEvents: [],
    userFeedback: [],
    // totalOfPayments: [],
    notes: String,
    // additionalInfo: {}
}, {collection: 'users'});