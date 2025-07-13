import React from 'react'
import {assets, footer_data} from "../assets/assets.js";

const Footer = () => {
    return (
        <div className={'px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'}>
            <div className='flex flex-col md:flex-row items-start justify-between gap-10 рy-10 border-b border-gray-500/30 text-gray-500'>
                <div>
                    <img src={assets.logo} alt={'logo'} className={'w-32 sm:w-44'} />
                    <p className={'max-w-[480px] mt-6'}>
                        Welcome to my personal blog — a space where I share my journey as a Software Engineering student, explore web development, cloud tools, and document real-world projects and learning experiences. Whether you're a fellow tech enthusiast or just curious, you're always welcome here.                    </p>
                </div>
                <div className={'flex flex-warp justify-between w-full md:w-[45%] gap-5'}>
                    {footer_data.map((section, index) => (
                        <div key={index}>
                            <h3 className={'font-semibold text-base text-gray-900 md:mb-5 mb-2'}>{section.title}</h3>
                            <ul className={'text-sm space-y-1'}>
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className={'hover:underline transition'}>{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
            <p className={'py-4 text-center text-sm md:text-base text-gray-500'}>Copyright 2025 © Dilmith Pathirana All Right Reserved.</p>

        </div>
    )
}
export default Footer
