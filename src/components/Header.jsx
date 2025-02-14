"use client";
import React from 'react';
import "../utils/Header.css";
import { usePathname } from 'next/navigation';

const Header = () => {

    const pathname = usePathname();


    const hideProfile = ['/']

    return (
        <div className='header'>
            <div className='header-content'>
                <div className='logo'>
                    <span><img src='./logo.svg' /></span>
                </div>
                <div className='title'>
                    <span><p>AMENTUM WEB SOLUTION</p></span>
                </div>
               <div className='profile'>
               {!hideProfile.includes(pathname) && <>
                    <img src='./profile.png' alt='User Profile' className='profile-pic' />
                    <div className='user-info'>
                        <span>Hello User</span>
                        <a href='#' className='logout'>Log Out ▼</a>
                    </div>
                    </>}
                </div>
            </div>
        </div>
    )
}


export default Header;