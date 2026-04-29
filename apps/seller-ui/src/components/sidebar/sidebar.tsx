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
import axiosInstance from "@/utils/axiosInstance";

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
                ? "text-[var(--color-text)] bg-[var(--color-surface-strong)] border border-[var(--color-border)]"
                : "text-[var(--color-text-muted)] border border-transparent hover:text-[var(--color-text)] hover:bg-[var(--color-surface-strong)]"
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

    const handleLogout = () => {
        // Implement logout logic here (e.g., clear tokens, redirect to login page)
        console.log("Logout clicked");
        axiosInstance.post("/logout")
            .then(() => {
                // Clear any client-side authentication data (e.g., cookies, localStorage)
                // Redirect to login page or homepage
                window.location.href = "/login"; // Adjust the path as needed
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });      
    }

    return (
        <div>
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="bg-[var(--color-surface-strong)] text-[var(--color-text-muted)] p-2 rounded-md border border-[var(--color-border)]">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{seller?.shop?.name || "Seller Dashboard"}</h2>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">{seller?.shop?.address || "Manage your shop"}</p>
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
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[15px] font-medium transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-strong)] cursor-pointer`}>
                    <LogOut size={20} />
                    Logout
                </div>
            </SidebarMenu>
        </div>
    );
};

export default SidebarWrapper;