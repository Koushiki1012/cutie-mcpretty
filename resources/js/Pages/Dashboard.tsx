import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Address {
    id: number;
    full_name: string;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
}

interface Order {
    id: number;
    order_id: string;
    total_amount: number;
    status: string;
    created_at: string;
}

interface DashboardProps extends PageProps {
    addresses?: Address[];
    orders?: Order[];
}


export default function Dashboard({ auth, addresses = [], orders = [] }: DashboardProps) {
    
    return (
        <AuthenticatedLayout
            // header
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    My Profile
                </h2>
            }
        >
            <Head title="Dashboard" />
            {/* Dashboard content */}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Main content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Order history */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Order History</h3>
                            
                            {orders.length > 0 ? (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg divide-y divide-gray-200 dark:divide-gray-700 pb-3">
                                    {orders.map((order) => (
                                        <div key={order.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Order #{order.order_id}</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{order.total_amount}</span>
                                                <span className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wide">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
                                    You haven't placed any orders yet. Go to the store to check out products!
                                </div>
                            )}
                        </div>

                        {/* Saved addresses */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Saved Addresses</h3>
                            
                            {addresses.length > 0 ? (
                                <div className="space-y-4">
                                    {addresses.map((address) => (
                                        <div key={address.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{address.full_name}</h4>
                                            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                                <p>{address.address}</p>
                                                <p>{address.city}, {address.postal_code}</p>
                                                <p className="pt-2 text-gray-900 dark:text-gray-100 font-medium">Phone: {address.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-sm text-gray-500 dark:text-gray-400">
                                    No addresses saved. Your shipping details will be saved here automatically after your first order.
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}