import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Event from "@/models/Event"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")

    const query: any = { userId: session.user.id }

    if (startDateParam && endDateParam) {
      query.start = { $gte: new Date(startDateParam) }
      query.end = { $lte: new Date(endDateParam) }
    } else if (startDateParam) {
      query.start = { $gte: new Date(startDateParam) }
    } else if (endDateParam) {
      query.end = { $lte: new Date(endDateParam) }
    }

    const events = await Event.find(query).sort({ start: 1 })
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ message: "Error fetching events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const newEvent = new Event({ ...body, userId: session.user.id })
    await newEvent.save()
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ message: "Error creating event" }, { status: 500 })
  }
}
