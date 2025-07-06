import { NextRequest, NextResponse } from 'next/server';
import { getCountries } from '../../../api/fetchData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const regions = searchParams.getAll('regions');

    const countries = await getCountries();
    const filteredCountries = regions?.length
      ? countries.filter(r => regions.includes(r.region))
      : countries;
    return NextResponse.json(filteredCountries);
  } catch (err) {
    console.error('Api/region/route:', err);
    return NextResponse.json(
      { message: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
