import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const location = searchParams.get('location')
    const propertyType = searchParams.get('propertyType')
    const bhk = searchParams.get('bhk')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const possessionStatus = searchParams.get('possessionStatus')
    const builder = searchParams.get('builder')
    const featured = searchParams.get('featured')
    const premium = searchParams.get('premium')

    const where: Record<string, unknown> = { status: 'active' }

    if (city) where.city = city
    if (location) where.location = { contains: location }
    if (propertyType) where.propertyType = propertyType
    if (bhk) where.bhk = { contains: bhk }
    if (possessionStatus) where.possessionStatus = possessionStatus
    if (builder) where.builder = { contains: builder }
    if (featured === 'true') where.featured = true
    if (premium === 'true') where.premium = true
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice)
    }

    const properties = await db.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const parsedProperties = properties.map((prop: any) => ({
      ...prop,
      images: JSON.parse(prop.images || '[]'),
      floorPlans: JSON.parse(prop.floorPlans || '[]'),
      amenities: JSON.parse(prop.amenities || '[]'),
      nearbyLandmarks: JSON.parse(prop.nearbyLandmarks || '[]')
    }))

    return NextResponse.json(parsedProperties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const dataToSave = { ...body }
    if (Array.isArray(dataToSave.images)) dataToSave.images = JSON.stringify(dataToSave.images)
    if (Array.isArray(dataToSave.floorPlans)) dataToSave.floorPlans = JSON.stringify(dataToSave.floorPlans)
    if (Array.isArray(dataToSave.amenities)) dataToSave.amenities = JSON.stringify(dataToSave.amenities)
    if (Array.isArray(dataToSave.nearbyLandmarks)) dataToSave.nearbyLandmarks = JSON.stringify(dataToSave.nearbyLandmarks)
    
    const property = await db.property.create({ data: dataToSave })
    
    const parsedProperty = {
      ...property,
      images: JSON.parse(property.images || '[]'),
      floorPlans: JSON.parse(property.floorPlans || '[]'),
      amenities: JSON.parse(property.amenities || '[]'),
      nearbyLandmarks: JSON.parse(property.nearbyLandmarks || '[]')
    }

    return NextResponse.json(parsedProperty, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
