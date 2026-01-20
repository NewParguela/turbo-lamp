import { UserAvatar } from "./userAvatar"
import type { User } from "../models.users"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { PhoneFormatter } from "@/components/ui/phoneFormatter"

const UsersList = ({
    children,
    className,
    ...props
}: React.ComponentProps<typeof ScrollArea>) => {

    return (
        <ScrollArea className={cn("flex-1", className)} {...props}>
            <div className="divide-y divide-border">
                {children}
            </div>
        </ScrollArea>
    )
}

UsersList.Section = ({ children, letter, ...props }: { letter: string } & React.ComponentProps<"div">) => {
    return (
        <div {...props}>
            {/* <div className="sticky top-0 z-10 bg-muted/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm"> */}
            <div className="sticky top-0 bg-muted/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                {letter}
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

UsersList.SectionItem = ({ user, className, ...props }: { user: User } & Omit<React.ComponentProps<"div">, "children">) => {
    return (
        <div
            className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-lesft transition-colors hover:bg-muted/60",
                className
            )}
            {...props}
        >
            <UserAvatar
                avatar={user.avatar ?? undefined}
                firstName={user.first_name}
                lastName={user.last_name ?? undefined}
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
        </div>
    )
}

UsersList.NotFound = ({ hasSearchQuery, className, ...props }: { hasSearchQuery?: boolean } & Omit<React.ComponentProps<"div">, "children">) => (
    <div className={cn("flex flex-1 flex-col items-center justify-center px-4 py-12 text-center", className)} {...props}>
        <p className="text-muted-foreground">No contacts found</p>
        {hasSearchQuery && (
            <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term
            </p>
        )}
    </div>
)



export { UsersList }