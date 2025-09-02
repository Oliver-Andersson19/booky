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
export const handleWebhook = (req, res) => {
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
      console.log("Payment succeeded for:", session.customer_email);
      console.log("Session ID:", session.id);
      console.log("Metadata:", session.metadata); // contains userId if you set it
      // TODO: Update your user in DB, set subscription status to active
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};