import crypto from 'crypto-js'
import axios from 'axios'
function App() {
  const pay = async(e) =>{
    e.preventDefault();
    let {data} = await axios.post('/razorpay/order')
    const options = {
      key:'rzp_test_W1y4OtQkDB7i1F',
      name:"Yes Mentor",
      description:"Yes Mentor",
      order_id:data.order.id,
      handler: async(response)=>{
        try {
          let secret = 'vMePFMfVFIVypJVhvnoYrhrf' ;
          const generated_signature = crypto.HmacSHA256(`${data.order.id}|${response.razorpay_payment_id}`, secret).toString();
          if(generated_signature === response.razorpay_signature){
            console.log("payment is successful")
            const captureResponse = await axios.post(`/razorpay/capture/${response.razorpay_payment_id}`, {})
            const successObj = JSON.parse(captureResponse.data)
            const captured = successObj.captured;
            if(captured){
              console.log("captured successfully");
            }else{
              console.log("captured fails")
            }
          }
        } catch (error) {
          console.log(error);
        }
        }
    }

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

  }
  return (
    <div>
    <button onClick={pay}>Pay</button>
    </div>
  );
}

export default App;
