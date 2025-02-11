// src/pages/api/verify-captcha.ts
import type { APIRoute } from 'astro';

const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { recaptchaResponse } = data;

  const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
  const verificationBody = new URLSearchParams({
    secret: RECAPTCHA_SECRET_KEY,
    response: recaptchaResponse,
  });

  try {
    const recaptchaVerification = await fetch(verificationURL, {
      method: 'POST',
      body: verificationBody,
    });

    const verificationResult = await recaptchaVerification.json();

    if (!verificationResult.success || verificationResult.score < 0.5) {
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA verification failed' }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, score: verificationResult.score }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to verify reCAPTCHA' }),
      { status: 500 }
    );
  }
};