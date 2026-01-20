import { cn } from "@/lib/utils"

interface UserAvatarProps {
    avatar?: string
    firstName?: string
    lastName?: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-24 w-24 text-3xl",
}

const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
]

export const UserAvatar = ({
    avatar,
    firstName = "",
    lastName = "",
    size = "md",
    className,
}: UserAvatarProps) => {

    if (avatar && avatar.length > 0) {
        return (
            <img src={avatar} alt={firstName} className={cn('rounded-full', sizeClasses[size], className)} />
        )
    }

    const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase()
    const firstInitialCode = firstName ? firstName.charCodeAt(0) : 0
    const lastInitialCode = lastName ? lastName.charCodeAt(0) : 0
    const colorIndex = (firstInitialCode + lastInitialCode) % colors.length
    const bgColor = colors[colorIndex]

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full font-medium text-white",
                sizeClasses[size],
                bgColor,
                className
            )}
        >
            {initials}
        </div>
    )
}
