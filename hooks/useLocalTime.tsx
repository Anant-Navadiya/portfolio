"use client"

import {useEffect, useState} from "react"

type UseLocalTimeOptions = {
    locale?: string
    hour12?: boolean
    showSeconds?: boolean
}

const useLocalTime = ({
                          locale = "en-DE",
                          hour12 = false,
                          showSeconds = false
                      }: UseLocalTimeOptions = {}) => {
    const [time, setTime] = useState("")
    const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone)

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()

            setTime(
                now.toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: showSeconds ? "2-digit" : undefined,
                    hour12
                })
            )
        }

        const timeout = setTimeout(updateTime, 0)
        const interval = setInterval(updateTime, 1000)

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [locale, hour12, showSeconds])

    return {time, timezone}
}

export default useLocalTime
