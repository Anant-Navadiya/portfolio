"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import useLocalTime from "@/hooks/useLocalTime";

const LocalTime = () => {

    const {time, timezone} = useLocalTime()

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <p className="cursor-pointer">{time}</p>
            </TooltipTrigger>
            <TooltipContent>
                {timezone}
            </TooltipContent>
        </Tooltip>
    )
}

export default LocalTime