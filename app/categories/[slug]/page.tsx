import { redirect } from 'next/navigation';
import { Catalog } from '@/components/catalog';
export default async function Page({ params }: {
    params: Promise<{
        slug: string;
    }>;
}) { const { slug } = await params; const legacy:Record<string,string>={office:'communication',creation:'marketing',business:'customers',finance:'data',operations:'workflow',people:'communication',product:'research',legal:'research'}; if(legacy[slug])redirect('/categories/'+legacy[slug]); return <Catalog categorySlug={slug}/>; }
