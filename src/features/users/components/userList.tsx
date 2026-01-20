import { Fragment, useMemo } from "react"
import type { User } from "../models.users"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UserListProps {
    users: Array<User>
    children?: (user: User) => React.ReactNode
}

export const UsersList = ({
    users,
    children,
}: UserListProps) => {

    // useEffect(() => {
    //     const el = sentinelRef.current
    //     if (!el) return

    //     const obs = new IntersectionObserver((entries) => {
    //       const first = entries[0]
    //       if (
    //         first?.isIntersecting &&
    //         q.hasNextPage &&
    //         !q.isFetchingNextPage
    //       ) {
    //         q.fetchNextPage()
    //       }
    //     })

    //     obs.observe(el)
    //     return () => obs.disconnect()
    //   }, [q.hasNextPage, q.isFetchingNextPage, q.fetchNextPage])

    const groupedUsers = useMemo(() => {
        const groups: Record<string, Array<User>> = {}
        const sorted = [...users].sort((a, b) =>
            a.first_name.localeCompare(b.first_name)
        )

        for (const user of sorted) {
            const letter = user.first_name[0].toUpperCase()
            groups[letter] ??= []
            groups[letter].push(user)
        }

        return groups
    }, [users])

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
