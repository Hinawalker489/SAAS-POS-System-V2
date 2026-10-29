"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    CreditCard,
    Receipt,
    BarChart3,
    Settings,
    Store,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "POS",
        href: "/pos",
        icon: Store
    },
    {
        title: "Products",
        href: "/products",
        icon: Package
    },
    {
        title: "Sales",
        href: "/sales",
        icon: ShoppingCart
    },
    {
        title: "Purchases",
        href: "/purchases",
        icon: CreditCard
    },
    {
        title: "Customers",
        href: "/customers",
        icon: Users
    },
    {
        title: "Expenses",
        href: "/expenses",
        icon: Receipt
    },
    {
        title: "Reports",
        href: "/reports",
        icon: BarChart3
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Store className="h-6 w-6" />
                    <span>SaaS POS</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto border-t p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
