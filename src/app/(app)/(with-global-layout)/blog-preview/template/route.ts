import { redirect } from 'next/navigation';

export async function GET() {
  // Redirect to the template preview URL
  redirect('/blog/__template-preview__');
}
