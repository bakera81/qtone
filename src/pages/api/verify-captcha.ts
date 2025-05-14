import type { APIRoute } from 'astro';
import * as Sentry from "@sentry/astro";

const RECAPTCHA_SECRET_KEY = import.meta.env.RECAPTCHA_SECRET_KEY;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { recaptchaToken } = data;

  const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
  const verificationBody = new URLSearchParams({
    secret: RECAPTCHA_SECRET_KEY,
    response: recaptchaToken,
  });

  try {
    const recaptchaVerification = await fetch(verificationURL, {
      method: 'POST',
      body: verificationBody,
    });

    const verificationResult = await recaptchaVerification.json();
    if (!verificationResult.success) {
      Sentry.captureMessage('reCAPTCHA verification failed', {
        level: 'warning',
        extra: verificationResult,
      });
      return new Response(
        JSON.stringify({ error: 'reCAPTCHA verification failed' }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to verify reCAPTCHA' }),
      { status: 500 }
    );
  }
};