import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const property = await db.property.findUnique({ where: { id } })
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    await db.property.update({ where: { id }, data: { views: { increment: 1 } } })
    
    const parsedProperty = {
      ...property,
      images: JSON.parse(property.images || '[]'),
      floorPlans: JSON.parse(property.floorPlans || '[]'),
      amenities: JSON.parse(property.amenities || '[]'),
      nearbyLandmarks: JSON.parse(property.nearbyLandmarks || '[]')
    }

    return NextResponse.json(parsedProperty)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const dataToUpdate = { ...body }
    if (Array.isArray(dataToUpdate.images)) dataToUpdate.images = JSON.stringify(dataToUpdate.images)
    if (Array.isArray(dataToUpdate.floorPlans)) dataToUpdate.floorPlans = JSON.stringify(dataToUpdate.floorPlans)
    if (Array.isArray(dataToUpdate.amenities)) dataToUpdate.amenities = JSON.stringify(dataToUpdate.amenities)
    if (Array.isArray(dataToUpdate.nearbyLandmarks)) dataToUpdate.nearbyLandmarks = JSON.stringify(dataToUpdate.nearbyLandmarks)

    const property = await db.property.update({ where: { id }, data: dataToUpdate })
    
    const parsedProperty = {
      ...property,
      images: JSON.parse(property.images || '[]'),
      floorPlans: JSON.parse(property.floorPlans || '[]'),
      amenities: JSON.parse(property.amenities || '[]'),
      nearbyLandmarks: JSON.parse(property.nearbyLandmarks || '[]')
    }

    return NextResponse.json(parsedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.property.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
  }
}
