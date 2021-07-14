import express, { json } from 'express'
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import request from 'request'

const app = express()
app.use(json())
dotenv.config()

var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
})


app.get('/',(req,res)=>{
    res.send("Razorpay");
})

app.post('/razorpay/order',(req,res)=>{
    var option = {
        amount: 10000,
        currency: "INR",
        receipt:"order101",
        payment_capture: 0,
    };
    instance.orders.create(option,(err,order)=>{
        if(err){
            res.status(500).json({
                message:"error on creating oderId",
                order:order,
                error:err
            });
            return;
        }else{
            res.status(200).json({
                message:"created oderId",
                order:order,
                error:err
            });
            return;
        }
    })
})

app.post('/razorpay/capture/:paymentID',(req,res)=>{
    try {
        return request(
            {
                method:"post",
                url: `https://${process.env.KEY_ID}:${process.env.KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentID}/capture`,
                form:{
                    amount: 10000,
                    currency:"INR"
                },
            },
            async function(err,response,body){
                if(err){
                    return res.status(500).json({
                      message: "Something error!s",
                      location:"/razorpay/capture/:paymentID"
                    })
                  }else{
                    return res.status(200).json(body)
                }
            }
            
        )
    } catch (error) {
        return res.status(500).json({
            message: error.message
          })
    }
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'))
}

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
})