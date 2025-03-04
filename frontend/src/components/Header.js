import React, { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, CreditCardIcon, SearchIcon } from "@heroicons/react/outline";
import useAuthStore from "../logic/authStore";
import useCarStore from "../logic/carStore";
import { client } from '../api/apolloClient';
import { GET_GARAGES } from "../api/main";
import debounce from 'lodash/debounce';

const Header = () => {
  const location = useLocation();
  const { isLoggedIn, user, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const { setCars } = useCarStore();

  const [searchState, setSearchState] = useState({
    query: "",
    isOpen: false,
    isLoading: false,
    error: null
  });

  const currentUser = isLoggedIn && user ? user : null;

  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim()) return;

      setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        navigate('/buy');
        setCars([]);
        const response = await client.query({
          query: GET_GARAGES,
          variables: { search: searchTerm.trim() }
        });
        setCars(response.data.garages);
        setSearchState(prev => ({
          ...prev,
          isOpen: false,
          query: "",
          isLoading: false
        }));
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          error: 'Failed to fetch results',
          isLoading: false
        }));
        console.error('Search error:', error);
      }
    }, 500),
    [navigate, setCars]
  );

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchState(prev => ({ ...prev, query: newQuery }));
    debouncedSearch(newQuery);
  };

  const toggleSearch = () => {
    setSearchState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      error: null
    }));
  };

  const navigation = [
    { name: "Home", href: "/", current: location.pathname === "/" },
    { name: "Buy", href: "/buy", current: location.pathname === "/buy" },
    ...(isLoggedIn && role === "Seller"
      ? [
          {
            name: "Sell",
            href: "/seller",
            current: location.pathname === "/seller",
          },
          {
            name: "Config Garage",
            href: "/seller/config",
            current: location.pathname === "/seller/config",
          }
        ]
      : [])
  ];

  const userNavigation = [
    {
      name: "Your Profile",
      href: "/user",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
    },
    {
      name: "Sign out",
      href: "/signin",
      onClick: logout,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      ),
    },
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      debouncedSearch(searchState.query);
    }
  };
  
  const classNames = (...classes) => classes.filter(Boolean).join(" ");

  const renderUserMenu = () =>
    currentUser ? (
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
              {currentUser?.role?.name || "User"}
            </div>
            {userNavigation.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <Link
                    to={item.href}
                    onClick={item.onClick}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "flex px-4 py-2 text-sm text-gray-700 items-center"
                    )}>
                    <svg
                      className="mr-3 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
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
            src={
              currentUser.imageUrl ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt={currentUser.name}
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
    );

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0">
                  <Link to="/" className="text-2xl font-bold text-white">
                    KODROD
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "rounded-full py-1 px-3 text-sm font-semibold text-white bg-gray-900"
                            : "rounded-full py-1 px-3 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 text-white py-1.5 px-4 flex items-center mr-4"
                    onClick={toggleSearch}
                  >
                    <span className="sr-only">Search</span>
                    <SearchIcon className="h-6 w-6 mr-2" />
                    Search
                  </button>
                  <Transition
                    show={searchState.isOpen}
                    enter="transition-all duration-500 ease-out"
                    enterFrom="transform opacity-0 translate-x-12"
                    enterTo="transform opacity-100 translate-x-0"
                    leave="transition-all duration-500 ease-in"
                    leaveFrom="transform opacity-100 translate-x-0"
                    leaveTo="transform opacity-0 translate-x-12"
                  >
                    <div className="ml-4 flex items-center">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchState.query}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="rounded-lg bg-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      />
                      <button
                        onClick={() => debouncedSearch(searchState.query)}
                        className="ml-2 rounded-full bg-gray-700 text-white px-4 py-2"
                      >
                        Search
                      </button>
                    </div>
                  </Transition>

                  {renderUserMenu()}
                </div>
              </div>
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
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              {currentUser ? (
                <div className="flex items-center px-5">
                  <div className="shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={
                        currentUser.imageUrl ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt={currentUser.name}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {currentUser.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="mt-3 space-y-1 px-2">
                {isLoggedIn ? (
                  userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      onClick={item.onClick}
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      Sign Up
                    </Link>
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
