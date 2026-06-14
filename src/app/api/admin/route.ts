import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    return NextResponse.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role })
  } catch (error) {
    console.error('Error authenticating admin:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
