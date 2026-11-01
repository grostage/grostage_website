import { redirect } from 'next/navigation'; import { isAdmin } from '@/backend/lib/auth'; import AdminClient from './AdminClient';
export const dynamic = 'force-dynamic'; export const metadata = { title: 'Admin — Grostage' };
export default async function Admin() { if (!(await isAdmin())) redirect('/adminportal/login'); return <AdminClient />; }
