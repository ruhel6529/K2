import Stripe from 'stripe';
import { buffer } from 'micro';
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {NextApiRequest, NextApiResponse} from "next";
import {supabaseClient} from "@/config/supabase-client";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);

export const config = {api: {bodyParser:false}}

const handlePaymentSuccess = async (req: NextApiRequest, res: NextApiResponse) => {


    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }
    let event;
    try {
        const rawBody = await buffer(req);

        // Verify the event from Stripe
        const sig = req.headers['stripe-signature'];

     event = stripe.webhooks.constructEvent(rawBody, sig, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET);

        // Handle payment_intent.succeeded event
        if (event.type === 'checkout.session.completed') {
            const paymentIntent = event.data.object;

            // Extract user ID from metadata (replace 'your_metadata_key' with the actual key you used)
            const userId = paymentIntent.metadata.userId;
            const creditsBought = parseInt(paymentIntent.metadata.creditValue)
            // Fetch the user's current credits from the Supabase table
            const { data: userData, error: userError } = await supabaseClient
                .from('credits')
                .select('credits')
                .eq('client_id', userId)
                .single();

            if (userError) {
                console.error('Error fetching user credits:', userError);
                return res.status(500).json({ error: 'An error occurred while fetching user credits.' });
            }

            const currentCredits = userData?.credits || 0;

            // Update the user's credits in the Supabase table
            const { error: updateError } = await supabaseClient
                .from('credits')
                .update({ credits: currentCredits + creditsBought }) // Adjust the amount as needed
                .eq('client_id', userId);

            if (updateError) {
                console.error('Error updating user credits:', updateError);
                return res.status(500).json({ error: 'An error occurred while updating user credits.' });
            }

            return res.status(200).json({ message: 'Credits updated successfully.' });
        }

        // Handle other event types if needed

        return res.status(200).end();
    } catch (error) {
        console.error('Error handling payment success:', error);
        return res.status(500).json({ error: 'An error occurred while handling payment success.' });
    }
};

export default handlePaymentSuccess;