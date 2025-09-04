import React from 'react'
import "./SubscribePage.css"
import { useAuth } from '../context/authContext';
import { fetchWithToken } from '../services/authService';

function SubscribePage() {

  const { user, accessToken, authFetch } = useAuth();

  console.log(accessToken)

  const plans = [
    {
      priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
      name: "Basic",
      price: "199kr",
      duration: "month",
    }
  ]

  const purchasePlan = async (priceId) => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        }
      );

      const data = await res.json();


      // Redirect user to Stripe checkout
      // window.location.href = data.url;
      console.log(data.url)


    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className='plans-container'>
      {plans.map((plan, i) => (<div className='plan-card' key={i}>
        <h1>{plan.name}</h1>
        <h2>{plan.price}</h2>
        <button onClick={() => purchasePlan(plan.priceId)} disabled={!accessToken || !user}>Purchase</button>
      </div>))}
    </div>
  )
}

export default SubscribePage
