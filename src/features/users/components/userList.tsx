import { Fragment, useMemo } from "react"
import type { User } from "../models.users"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UserListProps {
    users: Array<User>
    selectedId: string | null
    searchQuery: string
    children?: (user: User) => React.ReactNode

}

export const UsersList = ({
    users,
    searchQuery,
    children,
}: UserListProps) => {
    const filteredUsers = useMemo(() => {
        const query = searchQuery.toLowerCase()
        return users.filter(
            (user) =>
                user.first_name.toLowerCase().includes(query) ||
                user.last_name.toLowerCase().includes(query) ||
                user.phone.includes(query) ||
                user.email?.toLowerCase().includes(query)
        )
    }, [users, searchQuery])

    const groupedUsers = useMemo(() => {
        const groups: Record<string, Array<User>> = {}
        const sorted = [...filteredUsers].sort((a, b) =>
            a.first_name.localeCompare(b.first_name)
        )

        for (const user of sorted) {
            const letter = user.first_name[0].toUpperCase()
            if (!groups[letter]) {
                groups[letter] = []
            }
            groups[letter].push(user)
        }

        return groups
    }, [filteredUsers])

    if (filteredUsers.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
                <p className="text-muted-foreground">No contacts found</p>
                {searchQuery && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try a different search term
                    </p>
                )}
            </div>
        )
    }

    return (
        <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
                {Object.entries(groupedUsers).map(([letter, usersGroup]) => (
                    <div key={letter}>
                        <div className="sticky top-0 z-10 bg-muted/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                            {letter}
                        </div>
                        <div>
                            {usersGroup.map((user) => (
                                <Fragment key={user.id}>
                                    {children?.(user)}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}
