import type { NextApiRequest, NextApiResponse } from 'next';
import Ad_Capture from '@/app/screenshot/ad_capture';
import Label_Capture from '@/app/screenshot/label_capture';

const Generate = async (req: NextApiRequest, res: NextApiResponse) => {
    const { sku, content, langs } = req.query;

    if (!sku || typeof sku !== 'string') {
        return res.status(400).json({ message: 'Invalid SKU parameter.' });
    }
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: 'Invalid content parameter.' });
    }
    if (!langs || typeof langs !== 'string' ) {
        return res.status(400).json({ message: 'Invalid langs parameter.' });
    }

    // Ensure langs is an array
    const langsArray = Array.isArray(langs) ? langs : langs.split(',');

    try {
        let job_result;
        // Choose content type to generate
        switch (content.toLowerCase()) {
            case 'front':
                // Generate front label
                job_result = await Label_Capture(sku, content);
                break;
            case 'back':
                // Generate back label
                job_result = await Label_Capture(sku, content);
                break;
            case 'adverts':
                // Generate adverts
                job_result = await Ad_Capture(sku, content, langsArray);
                break;
            default:
                // Handling unknown content type
                return res.status(400).json({ message: 'Unsupported content type.' });
        }

        // Assuming both Ad_Capture and Label_Capture functions return an object with a job_status property on success
        if (job_result) {
            return res.status(200).json({ message: 'Success' });
        } else {
            // Handle failure case for Ad_Capture and Label_Capture
            return res.status(500).json({ message: 'Failure during job execution.' });
        }
    } catch (error: any) {
        // Generic error handling
        return res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
};

export default Generate;