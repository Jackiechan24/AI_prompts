import { Detail } from '@/components/detail';
export default async function Page({ params }: {
    params: Promise<{
        slug: string;
    }>;
}) { return <Detail slug={(await params).slug}/>; }
