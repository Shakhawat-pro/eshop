"use client";

import useSeller from "@/hooks/useSeller";
import useSidebar from "@/hooks/useSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import SidebarMenu from "./SidebarMenu";
import {
    LayoutDashboard,
    ShoppingBag,
    CreditCard,
    PlusSquare,
    Package,
    CalendarPlus,
    Calendar,
    Inbox,
    Settings,
    Bell,
    Ticket,
    LogOut,
} from "lucide-react";

// ✅ Separate component (better performance & readability)
const SidebarItem = ({
    route,
    icon: Icon,
    label,
    isActive,
}: {
    route: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
}) => {
    return (
        <Link
            href={route}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-[15px] font-medium transition-colors ${isActive
                ? "text-white bg-[#00358b]"
                : "text-gray-400 hover:text-gray-100 hover:bg-blue-500/30"
                }`}
        >
            <Icon size={20} />
            {label}
        </Link>
    );
};

const SidebarWrapper = () => {
    const { activeSidebar, setActiveSidebar } = useSidebar();
    const pathname = usePathname();
    const { seller } = useSeller();

    console.log("Seller data in SidebarWrapper:", seller);

    // ✅ Correct dependency
    useEffect(() => {
        setActiveSidebar(pathname);
    }, [pathname, setActiveSidebar]);

    // ✅ Memoized helper
    const isActive = useCallback(
        (route: string) => activeSidebar === route,
        [activeSidebar]
    );

    return (
        <div>
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="bg-slate-800 text-slate-400 p-2 rounded-md">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{seller?.shop?.name || "Seller Dashboard"}</h2>
                        <p className="text-xs text-slate-500 line-clamp-1">{seller?.shop?.address || "Manage your shop"}</p>
                    </div>
                </Link>
            </div>

            <SidebarItem
                route="/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
                isActive={isActive("/dashboard")}
            />
            {/* MAIN MENU */}
            <SidebarMenu title="Main Menu">
                <SidebarItem
                    route="/dashboard/orders"
                    icon={ShoppingBag}
                    label="Orders"
                    isActive={isActive("/dashboard/orders")}
                />
                <SidebarItem
                    route="/dashboard/payments"
                    icon={CreditCard}
                    label="Payments"
                    isActive={isActive("/dashboard/payments")}
                />
            </SidebarMenu>

            {/* PRODUCTS */}
            <SidebarMenu title="Products">
                <SidebarItem
                    route="/dashboard/products/create"
                    icon={PlusSquare}
                    label="Create Product"
                    isActive={isActive("/dashboard/products/create")}
                />
                <SidebarItem
                    route="/dashboard/products"
                    icon={Package}
                    label="All Products"
                    isActive={isActive("/dashboard/products")}
                />
            </SidebarMenu>

            {/* EVENTS */}
            <SidebarMenu title="Events">
                <SidebarItem
                    route="/dashboard/events/create"
                    icon={CalendarPlus}
                    label="Create Event"
                    isActive={isActive("/dashboard/events/create")}
                />
                <SidebarItem
                    route="/dashboard/events"
                    icon={Calendar}
                    label="All Events"
                    isActive={isActive("/dashboard/events")}
                />
            </SidebarMenu>

            {/* CONTROLLERS */}
            <SidebarMenu title="Controllers">
                <SidebarItem
                    route="/dashboard/inbox"
                    icon={Inbox}
                    label="Inbox"
                    isActive={isActive("/dashboard/inbox")}
                />
                <SidebarItem
                    route="/dashboard/settings"
                    icon={Settings}
                    label="Settings"
                    isActive={isActive("/dashboard/settings")}
                />
                <SidebarItem
                    route="/dashboard/notifications"
                    icon={Bell}
                    label="Notifications"
                    isActive={isActive("/dashboard/notifications")}
                />
            </SidebarMenu>

            {/* EXTRAS */}
            <SidebarMenu title="Extras">
                <SidebarItem
                    route="/dashboard/discount-codes"
                    icon={Ticket}
                    label="Discount Codes"
                    isActive={isActive("/dashboard/discount-codes")}
                />
                {/* <SidebarItem
                    route="/logout"
                    icon={LogOut}
                    label="Logout"
                    isActive={isActive("/logout")}
                /> */}
                <div

                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[15px] font-medium transition-colors text-gray-400 hover:text-gray-100 hover:bg-blue-500/30 cursor-pointer`}>
                    <LogOut size={20} />
                    Logout
                </div>
            </SidebarMenu>
        </div>
    );
};

export default SidebarWrapper;