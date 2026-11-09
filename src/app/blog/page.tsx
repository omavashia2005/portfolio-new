import { redirect } from 'next/navigation';

// writing lives in the home tabs now; keep old /blog links working
export default function BlogPage() {
  redirect('/?tab=writing');
}
