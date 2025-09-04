import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// /api/payments/...



// Denna ger frontend en URL att skicka användaren till för att betala
export const createCheckoutSession = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ message: "Price ID is required" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      customer_email: user.email,
      metadata: { userId: user.id },
      // success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      
      success_url: "http://localhost:5173/subscribe",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};


//Här hanterar man om det blir en lyckad betalning eller inte
export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Use your webhook secret from Stripe dashboard
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(session)
      console.log("Payment succeeded for:", session.customer_email);
      console.log("Session ID:", session.id);
      console.log("Metadata:", session.metadata); // contains userId if you set it


      // Retrieve subscription and customer info from Stripe
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const customer = await stripe.customers.retrieve(session.customer);

      // This would get saved to db
      console.log({
        customerId: customer.id,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        priceId: subscription.items.data[0].price.id,
        subscriptionStart: subscription.current_period_start,
        subscriptionEnd: subscription.current_period_end,
        customerEmail: session.customer_email
      });
      // Update user in your DB
      // await pool.query(
      //   `UPDATE users
      //     SET stripeCustomerId = $1,
      //         stripeSubscriptionId = $2,
      //         subscriptionStatus = $3,
      //         subscriptionPriceId = $4,
      //         subscriptionStart = to_timestamp($5),
      //         subscriptionEnd = to_timestamp($6)
      //     WHERE email = $7`,
      //   [
      //     customer.id,
      //     subscription.id,
      //     subscription.status,
      //     subscription.items.data[0].price.id,
      //     subscription.current_period_start,
      //     subscription.current_period_end,
      //     session.customer_email
      //   ]
      // );

      console.log(`Subscription info saved for ${session.customer_email}`);
      break;

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;

      console.log({
        customerId: sub.customer,
        subscriptionId: sub.id,
        subscriptionStatus: sub.status,
        priceId: sub.items?.data?.[0]?.price?.id,
        subscriptionStart: sub.current_period_start,
        subscriptionEnd: sub.current_period_end
      });
        // await pool.query(
        //   `UPDATE users
        //    SET subscriptionStatus = $1,
        //        subscriptionEnd = to_timestamp($2)
        //    WHERE stripeSubscriptionId = $3`,
        //   [
        //     sub.status,
        //     sub.current_period_end,
        //     sub.id
        //   ]
        // );

        console.log(`Subscription status updated for subscription ${sub.id}`);
        break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};