import type { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data'
export interface ImageData {
    message: string;
    image_id: string;
    images: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        image,
        pos_prompt,
        neg_prompt,
        numberOfImages,
        x,
       y,
        scaleFactor
    } = req.body;

    try {
        const formData = new FormData();
        formData.append('upload_id', image);
        formData.append('pos_prompt', pos_prompt);
        formData.append('neg_prompt', neg_prompt);
        formData.append('number_of_images', numberOfImages);
        formData.append('x', x);
        formData.append('y', y);
        formData.append('scale', scaleFactor);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/replace-background`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOKKER_API_KEY}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseJSON: ImageData = await response.json();
        res.status(200).json(responseJSON);
    } catch (error) {
        console.log(error, 'response image call error');
        res.status(500).json({ message: 'Internal server error' });
    }
}