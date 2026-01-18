"use client";
import { UserAvatar } from "./userAvatar";
import type { User } from "../models.users";
import { cn } from "@/lib/utils";
import { PhoneFormatter } from "@/components/ui/phoneFormatter";

interface UserListItemProps {
    user: User
    className?: string
}

export const UserListItem = ({
    user,
    className,
}: UserListItemProps) => {
    return (
        <div
            className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                className
            )}
        >
            <UserAvatar
                avatar={user.avatar}
                firstName={user.first_name}
                lastName={user.last_name}
                size="md"
            />
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                    {user.first_name} {user.last_name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                    <PhoneFormatter phone={user.phone} />
                </p>
            </div>
            {/* {contact.isFavorite && (
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      )} */}
        </div>
    )
}
