import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, SearchIcon } from '@heroicons/react/outline';
import { AuthContext } from '../context/Auth.context';

const DEFAULT_USER = {
    name: 'Guest',
    email: 'guest@example.com',
    imageUrl: 'https://as1.ftcdn.net/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
};

const Header = () => {
    const location = useLocation();
    const { state, logout } = useContext(AuthContext);
    const [showSearch, setShowSearch] = useState(false);

    const user = state.user || DEFAULT_USER;

    const navigation = [
        { name: 'Home', href: '/', current: location.pathname === '/' },
        { name: 'Buy', href: '/buy', current: location.pathname === '/buy' },
        ...(state.isLoggedIn && state.user?.role?.type === 'seller' 
            ? [{ name: 'Sell', href: '/seller', current: location.pathname === '/seller' }] 
            : []),
        { name: 'About', href: '/about', current: location.pathname === '/about' },
    ];

    const userNavigation = [
        { 
            name: 'Your Profile', 
            href: '/users',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        },
        { 
            name: 'Sign out', 
            href: '/signin', 
            onClick: logout,
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        },
    ];

    const classNames = (...classes) => classes.filter(Boolean).join(' ');

    const renderUserMenu = () => (
        state.isLoggedIn ? (
            <Menu as="div" className="relative ml-3">
                <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-2 text-xs text-gray-500">
                            {state.user?.role?.type || 'User'}
                        </div>
                        {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                                {({ active }) => (
                                    <Link
                                        to={item.href}
                                        onClick={item.onClick}
                                        className={classNames(
                                            active ? 'bg-gray-100' : '',
                                            'flex px-4 py-2 text-sm text-gray-700 items-center'
                                        )}
                                    >
                                        <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {item.icon}
                                        </svg>
                                        {item.name}
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user.imageUrl}
                        alt=""
                    />
                </Menu.Button>
            </Menu>
        ) : (
            <div className="flex space-x-4">
                <Link
                    to="/signin"
                    className="rounded-full bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                >
                    Sign In
                </Link>
                <Link
                    to="/signup"
                    className="rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                >
                    Sign Up
                </Link>
            </div>
        )
    );

    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <Link to="/" className="text-2xl font-bold text-white">KODROD</Link>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                aria-current={item.current ? 'page' : undefined}
                                                className={classNames(
                                                    item.current
                                                        ? 'rounded-full py-1 px-3 text-sm font-semibold text-white bg-gray-900 focus:outline-none focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                                        : 'rounded-full py-1 px-3 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* search button */}
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <button
                                        type="button"
                                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                                        onClick={(e) => e.currentTarget.blur()}
                                    >
                                        <span className="sr-only">Search</span>
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </button>
                                    {/* Profile dropdown */}
                                    {renderUserMenu()}
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <div className="-mr-2 flex md:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="sr-only">Open main menu</span>
                                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    <XIcon className="hidden h-6 w-6" aria-hidden="true" />
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium',
                                    )}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>

                        {/* User profile */}
                        <div className="border-t border-gray-700 pt-4 pb-3">
                            <div className="flex items-center px-5">
                                <div className="shrink-0">
                                    <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                </div>

                                {/* User name and email */}
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                </div>

                                {/* Search button */}
                                <button
                                    type="button"
                                    className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    <span className="sr-only">Search</span>
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* menu drop down profile, setting, sign out */}
                            <div className="mt-3 space-y-1 px-2">
                                {state.isLoggedIn ? (
                                    userNavigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            onClick={item.onClick}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))
                                ) : (
                                    <>
                                        <Disclosure.Button
                                            as="a"
                                            href="/signin"
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            Sign In
                                        </Disclosure.Button>
                                        <Disclosure.Button
                                            as="a"
                                            href="/signup"
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            Sign Up
                                        </Disclosure.Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Header;