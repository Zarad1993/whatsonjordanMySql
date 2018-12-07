var mongoose = require('mongoose');

// var bcrypt   = require('bcrypt-nodejs');

var usersSchema = mongoose.Schema({
	userType: {
		type: String, 
		default: 'user', 
		enum:['user', 'maker', 'admin', 'superadmin']},
	password: String,
	name:{
		firstName: String,
		middleName: String,
		lastName: String
	},
	email: String,
	profileImage: {
		type: {},
		default: {filename: "/img/profileImages/avatar.png"}
	},
	events: [{type: mongoose.Schema.Types.ObjectId, ref: 'eventsDB'}],
	registeredEventsList: [{type: mongoose.Schema.Types.ObjectId, ref:'eventsDB'}],
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
    gender: String,
    DOB: Date,
    grade: String,
    school: String,
    medical: {
    	medicalIssues: String,
    	problemDetails: String 
    },
    contact:{
        phone: String,
	    father:{
	    	name: String,
	    	phone: String
	    },
	    mother:{
	    	name: String,
	    	phone: String
	    },
	    emergency:{
	    	name: String,
	    	phone: String
	    },
	    phone1: String,
	    phone2: String
    },
    address: String,
    nationality: String,
    payments: [],
    attendedEvents: [],
    userFeedback: [],
    // totalOfPayments: [],
    notes: String,
    resetPasswordToken: String,
 	resetPasswordExpires: Date,
    // additionalInfo: {}
}, {collection: 'users'});




// methods ======================
// generating a hash
// usersSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };


// checking if password is valid
// usersSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };



module.exports = usersSchema;