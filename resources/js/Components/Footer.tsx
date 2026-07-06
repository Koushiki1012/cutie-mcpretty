import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { User } from '@/types';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {

    return (
        <footer className='flex justify-center bg-gradient-to-l from-red-100 p-6' >
            @ Copyright and Stuff 
        </footer>
    );
}