"use client"

import {useTheme} from "next-themes"
import {Button} from "@/components/ui/button"
import {useEffect, useState} from "react";

const ThemeToggler = () => {

    const [mounted, setMounted] = useState(false)

    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        const timeout = setTimeout(() => setMounted(true), 0)

        return () => clearTimeout(timeout)
    }, [])

    if (!mounted) {
        return <div className="size-5" />
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <Button
            variant="link"
            size="icon"
            className="rounded-full cursor-pointer"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            <span className="relative size-5 text-foreground">
                <i className="icon-[lucide--sun] absolute inset-0 size-5 transition-all duration-50 scale-100 rotate-0 [html[data-theme=dark]_&]:scale-0 [html[data-theme=dark]_&]:-rotate-90"/>
                <i className="icon-[lucide--moon] absolute inset-0 size-5 transition-all duration-50 scale-0 rotate-90 [html[data-theme=dark]_&]:scale-100 [html[data-theme=dark]_&]:rotate-0"/>
            </span>
        </Button>
    )
}

export default ThemeToggler
