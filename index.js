const app = require('express')()
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')
const UserData = require('./models/userDataModel')
const connectDb = require('./connectdb')
const bcrypt = require("bcryptjs");
const User = require('./models/user')
const jwt = require("jsonwebtoken");
connectDb()
// const nodemailer = require("nodemailer");
const {sendmail} = require('./mail')
require('dotenv').config()
const authMiddleware = require('./middleware/authMiddleware')




app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: process.env.YOURID,
	key_secret: process.env.YOURSEC
})

app.get('/logo.svg', (req, res) => {
	// sendmail('arun').catch(console.error);
	res.sendFile(path.join(__dirname, 'logo.svg'))
})

app.post('/email',async(req,res)=>{
	console.log('working')
 let details = {
			 name:req.body.payload.payment.entity.notes.name,
            email: req.body.payload.payment.entity.email,
            startingAdd:req.body.payload.payment.entity.notes.startingAddress,
            endingAdd:req.body.payload.payment.entity.notes.destinationAddress,
			phoneNumber:req.body.payload.payment.entity.contact,
		}
 sendmail(
	 details.name,
	 details.startingAdd,
	 details.endingAdd,
	 details.phoneNumber,
	 details.email).catch(console.error);
			
	res.json({ status: 'ok' })

})

app.post('/verification', async(req, res) => {
	// do a validation
	const secret = '12345678'

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		const newData = {
			phoneNumber:req.body.payload.payment.entity.contact,
			travel:[]
		}
		newData.travel.unshift({
            name:req.body.payload.payment.entity.notes.name,
            email: req.body.payload.payment.entity.email,
            startingAdd:req.body.payload.payment.entity.notes.startingAddress,
            endingAdd:req.body.payload.payment.entity.notes.destinationAddress,
            startlat:req.body.payload.payment.entity.notes.startinglat,
            startlong:req.body.payload.payment.entity.notes.startinglog,
            endlat:req.body.payload.payment.entity.notes.endinglat,
            endlot:req.body.payload.payment.entity.notes.endinglog,
            _id:req.body.payload.payment.entity.id,
            orderId:req.body.payload.payment.entity.order_id,
            distance:req.body.payload.payment.entity.notes.distance,
            advance:req.body.payload.payment.entity.notes.advance,
            billAmount:(req.body.payload.payment.entity.notes.advance*10).toString()
		})

  
	    // sendmail(req.body.payload.payment.entity.notes.name,req.body.payload.payment.entity.notes.startingAddress,req.body.payload.payment.entity.notes.destinationAddress,req.body.payload.payment.entity.notes.advance,req.body.payload.payment.entity.contact)
		// sendmail('arun').catch(console.error);
	
		try{
		let userData = await new UserData(newData).save()
		// console.log(userData)
		}catch(e){
			console.log(e)
		}
		// require('fs').writeFileSync('payment3.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
	// console.log(req.body)
	let  distance = req.body.distance
	
	const payment_capture = 1
	let distanceInKm = distance/1000;
	let amount = Math.round(distanceInKm*10)
	let advance = (amount/10)
	// console.log(advance)
	// const amount = 499
	const currency = 'INR'

	const options = {
		amount: advance * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture,
	   notes:{
		   ...req.body,
		   advance
	   }
	}

	try {
		const response = await razorpay.orders.create(options)
		// console.log(response)
		// sendmail('arun')
	    // sendmail(req.body.payload.payment.entity.notes.name,req.body.payload.payment.entity.notes.startingAddress,req.body.payload.payment.entity.notes.destinationAddress,req.body.payload.payment.entity.notes.advance,req.body.payload.payment.entity.contact)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.get('/admin',authMiddleware,async(req,res)=>{
	// console.log(req.headers.authorization);
	let dats = await UserData.find().sort({ createdAt: -1 })
	res.json(dats).status(200)
})

app.post('/login',async(req,res)=>{
	const { username, password } = req.body;
	console.log(username);
	console.log(password);
	if (password.length < 6) {
		return res.status(401).send("Password must be atleast 6 characters");
	  }

	  try {
		const user = await User.findOne({ username: username.toLowerCase() }).select(
		  "+password"
		);

		if (!user) {
			return res.status(401).send("Invalid Credentials");
		  }

		  const isPassword = await bcrypt.compare(password, user.password);
		  if (!isPassword) {
			return res.status(401).send("Invalid Credentials");
		  }  
		  const payload = { userId: user._id };
              jwt.sign(payload, process.env.jwtSecret, { expiresIn: "2d" }, (err, token) => {
             if (err) throw err;
              res.status(200).json(token);
             });
			}
            catch (error) {
            console.error(error);
             return res.status(500).send(`Server error`);
  }
})


let signup = async() =>{
	let user1 = {username:'arunarun',password:'123456'}
	user1.password=await bcrypt.hash('123456', 10);
	let user = new User(user1);
	await user.save()
	const payload = { userId: user._id };
	jwt.sign(payload, process.env.jwtSecret, { expiresIn: "2d" }, (err, token) => {
	  if (err) throw err;
	});
}

// signup()

app.listen(1337, () => {
	console.log('Listening on 1337')
})
