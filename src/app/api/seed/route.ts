import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PROPERTIES, TESTIMONIALS } from '@/lib/data'

export async function POST() {
  try {
    // Create admin
    await db.admin.upsert({
      where: { email: 'admin@newerareality.in' },
      update: {},
      create: {
        email: 'admin@newerareality.in',
        password: 'admin123',
        name: 'Rohit Kumar',
        role: 'admin',
      },
    })

    // Seed properties
    for (const prop of PROPERTIES) {
      await db.property.upsert({
        where: { slug: prop.slug },
        update: {},
        create: {
          slug: prop.slug,
          name: prop.name,
          tagline: prop.tagline,
          description: prop.description,
          propertyType: prop.propertyType,
          bhk: prop.bhk,
          bhkNumber: prop.bhkNumber,
          price: prop.price,
          priceLabel: prop.priceLabel,
          pricePerSqft: prop.pricePerSqft,
          areaSqft: prop.areaSqft,
          carpetArea: prop.carpetArea,
          builtUpArea: prop.builtUpArea,
          location: prop.location,
          city: prop.city,
          address: prop.address,
          possessionStatus: prop.possessionStatus,
          furnishing: prop.furnishing,
          transactionType: prop.transactionType,
          builder: prop.builder,
          floorCount: prop.floorCount,
          featured: prop.featured,
          premium: prop.premium,
          reraRegistered: prop.reraRegistered,
          reraId: prop.reraId,
          images: JSON.stringify(prop.images),
          floorPlans: JSON.stringify(prop.floorPlans),
          amenities: JSON.stringify(prop.amenities),
          nearbyLandmarks: JSON.stringify(prop.nearbyLandmarks),
          views: prop.views,
          likes: prop.likes,
          inquiries: prop.inquiries,
          status: prop.status,
        },
      })
    }

    // Seed testimonials
    for (const test of TESTIMONIALS) {
      await db.testimonial.create({
        data: {
          clientName: test.clientName,
          clientLocation: test.clientLocation,
          propertyPurchased: test.propertyPurchased,
          rating: test.rating,
          testimonial: test.testimonial,
          investmentStory: test.investmentStory,
          featured: test.featured,
          approved: true,
        },
      })
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
