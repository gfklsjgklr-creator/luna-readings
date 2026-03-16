import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const PRODUCTS: Record<string, { name: string; description: string; amount: number }> = {
  birth_chart: {
    name: "Birth Chart Reading by Luna",
    description: "A deeply personalized birth chart reading based on your unique cosmic blueprint.",
    amount: 999,
  },
  love_compatibility: {
    name: "Love Compatibility Reading by Luna",
    description: "Explore the celestial chemistry between two souls.",
    amount: 1499,
  },
  career_guidance: {
    name: "Career Guidance Reading by Luna",
    description: "Align your professional path with cosmic wisdom.",
    amount: 1299,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_type, formData } = body;

    const product = PRODUCTS[product_type];
    if (!product) {
      return NextResponse.json({ error: "Invalid product type" }, { status: 400 });
    }

    if (!formData?.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: product.amount,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        product_type,
        form_data: JSON.stringify(formData),
      },
      customer_email: formData.email,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: `Checkout failed: ${message}` },
      { status: 500 }
    );
  }
}
