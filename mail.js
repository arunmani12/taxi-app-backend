let nodemailer = require("nodemailer");

module.exports.sendmail = async(name,from,to,ph,em) =>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'arunmani9787@gmail.com',
            pass:'9787480892'
        }
    })

    console.log('ok')

    const mailOptions = {
        from :'arunmani9787@gmail.com',
        to:'arunmani9787@gmail.com',
        subject:`new car booked by ${name}`,
        text:`New car is booked by ${name} from ${from} to ${to} 
        email:${em},
        phone number:${ph}
        for the order conformation and for more details vist admin pannel :)`
    }

    

    console.log('ok2')
    let info = await transporter.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // await transporter.sendMail(mailOptions,(error,info)=>{
    //     console.log('ok3')
    //     if(error){
    //         console.log(error)

    //     }else{
    //         console.log('Emailsend '+info.response)
    //     }
    // })
}

