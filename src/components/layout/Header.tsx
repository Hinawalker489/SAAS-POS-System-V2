"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function Header() {
    const { data: session } = useSession()

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
            <div className="w-full flex-1">
                <h2 className="text-sm font-semibold text-muted-foreground">
                    {session?.user?.name || "User"}
                </h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium">{session?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session?.user?.role}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    )
}
