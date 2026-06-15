import PropertyDetailPage from '@/components/sections/PropertyDetailPage'

export default async function Property({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PropertyDetailPage propertyId={resolvedParams.id} />
}
