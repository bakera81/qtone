import type { APIRoute } from "astro";
import Airtable from "airtable";

const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = import.meta.env.AIRTABLE_TABLE_ID;
const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, meetingSoftware, meetingSoftwareOther, os, userResearch, recaptchaToken } = data;

    // Verify reCAPTCHA token
    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
    const verificationBody = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: recaptchaToken,
    });

    const recaptchaVerification = await fetch(verificationURL, {
      method: 'POST',
      body: verificationBody,
    });

    const verificationResult = await recaptchaVerification.json();
    if (!verificationResult.success) {
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA verification failed' }),
        { status: 400 }
      );
    }

    // Initialize Airtable
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    // Submit to Airtable
    await base(AIRTABLE_TABLE_ID).create([
      {
        fields: {
          'fldszcOStHoE0OgyG': email,
          'fldiMRQaXixtdrxE0': meetingSoftware,
          'flddOpe2yRs9oYIkt': meetingSoftware === 'Other' ? meetingSoftwareOther : '',
          'fldJZQ4Haneeh0Dtb': os,
          'fldokprg7xVuUbp7s': userResearch,
          'fldKRRMCKeh1DaNvR': new Date().toISOString(),
        },
      },
    ]);

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};
