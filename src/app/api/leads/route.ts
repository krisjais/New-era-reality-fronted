import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const leads = await db.lead.findMany({ orderBy: { createdAt: 'desc' }, include: { property: true } })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const lead = await db.lead.create({ data: body })

    // Create notification with phone number for quick contact
    await db.notification.create({
      data: {
        type: body.leadType || 'inquiry',
        title: `New ${body.leadType || 'Inquiry'}`,
        message: `${body.name} (${body.phone}) submitted a ${body.leadType || 'inquiry'}${body.propertyId ? ' for a property' : ''}`,
        phone: body.phone || null,
        leadName: body.name || null,
        leadId: lead.id,
        propertyId: body.propertyId || null,
      },
    })

    // Increment property inquiries if applicable
    if (body.propertyId) {
      await db.property.update({
        where: { id: body.propertyId },
        data: { inquiries: { increment: 1 } },
      })
    }

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
