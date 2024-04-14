import { NextApiRequest, NextApiResponse } from "next";
 // Import the initialized stripe instance
import Stripe from 'stripe'
import metadata from "next/dist/server/typescript/rules/metadata";



const createCheckoutSession = async (req: NextApiRequest, res: NextApiResponse) => {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY, {
        apiVersion: '2020-08-27' // Specify the desired API version
    });
    if (req.method !== "POST") {
        return res.status(405).end(); // Method Not Allowed
    }

    const { priceId, userId, creditValue } = req.body;

    try {
        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {

                    price: priceId,
                    quantity: 1,
                },

            ],

            metadata : {
                userId: userId,
                creditValue: creditValue
            },
            mode: "payment",
            success_url: `${req.headers.origin}/Profile?status=success`,
            cancel_url: `${req.headers.origin}/Profile?status=cancel`,
        });
        console.log(userId)

        return res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return res.status(500).json({ error: "An error occurred while creating the checkout session." });
    }
};

export default createCheckoutSession;