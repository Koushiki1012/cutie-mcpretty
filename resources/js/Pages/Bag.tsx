import BagItemCard from '@/Components/BagItemCard';
import Navbar from '@/Components/Navbar';
import { PageProps } from '@/types';

export default function BagPage({ auth, bagItems }: PageProps & { bagItems: any[] }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={auth.user} />
            
            <main className="max-w-4xl mx-auto py-12 px-4 mt-16">
                <h1 className="text-2xl font-bold mb-6">Your Shopping Bag</h1>

                {bagItems && bagItems.length > 0 ? (
                    <div className="space-y-4">
                        {bagItems.map((item) => (
                            <BagItemCard key={item.id} product={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                        <p className="text-gray-500">Your bag is currently empty.</p>
                    </div>
                )}
            </main>
        </div>
    );
}