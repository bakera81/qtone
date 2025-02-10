// src/pages/api/submit-form.ts
import type { APIRoute } from "astro";
import Airtable from "airtable";

const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_TABLE_ID = import.meta.env.AIRTABLE_TABLE_ID;
const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, meetingSoftware, meetingSoftwareOther, os, userResearch, recaptchaResponse } = data;

    // Verify reCAPTCHA
    const recaptchaVerification = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`,
      }
    );

    const recaptchaResult = await recaptchaVerification.json();
    // For v3, check both success and score
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), {
        status: 400,
      });
    }

    // Initialize Airtable
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

    // Submit to Airtable
    await base(AIRTABLE_TABLE_ID).create([
      {
        // Field names and IDs can be used interchangably, but IDs are less brittle.
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