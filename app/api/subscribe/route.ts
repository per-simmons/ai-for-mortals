import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 })
    }

    // Call the Loops.so API from the server
    const response = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 8b8a6e448bebf6daf1f7907f5bb2a88f",
      },
      body: JSON.stringify({
        eventName: "Subscribe",
        email: email,
      }),
    })

    const loopsData = await response.json()

    if (!response.ok) {
      console.error("Loops API error:", loopsData)
      return NextResponse.json(
        { success: false, message: "Error from subscription service" },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
    })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ success: false, message: "Server error processing subscription" }, { status: 500 })
  }
}
