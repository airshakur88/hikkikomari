import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contactMethod, contact, subject, message } = body;

    if (!name || !contactMethod || !contact || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    const userId = process.env.NEXT_PUBLIC_DISCORD_USER_ID;

    const mentionPayload = {
      content: `<@${userId}>`,
      username: name,
    };

    const embedPayload = {
      embeds: [
        {
          title: subject,
          description: message,
          color: 0xff59b7,
          fields: [
            {
              name: contactMethod,
              value: contact,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
      username: name,
      attachments: [],
    };

    const headers = { "Content-Type": "application/json" };

    const mentionResponse = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(mentionPayload),
    });

    if (!mentionResponse.ok) {
      return NextResponse.json(
        { error: "Failed to send mention" },
        { status: 502 },
      );
    }

    const embedResponse = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(embedPayload),
    });

    if (!embedResponse.ok) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
