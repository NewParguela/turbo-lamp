"use client"

import React from "react";

import { Mail, MessageSquare, Pencil, Phone, Trash2, Video } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "./userAvatar";
import type { User } from "../models.users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPhone } from "@/components/ui/phoneFormatter";

interface UserDetailProps {
    user: User
}

export const UserDetail = ({
    user,
}: UserDetailProps) => {
    return (
        <div className="flex h-full flex-col">
            {/* Header with avatar and name */}
            <div className="flex flex-col items-center border-b border-border bg-card px-6 py-8">
                <UserAvatar
                    avatar={user.avatar ?? undefined}
                    firstName={user.first_name}
                    lastName={user.last_name ?? undefined}
                    size="xl"
                />
                <h2 className="mt-4 text-2xl font-semibold text-card-foreground">
                    {user.first_name} {user.last_name}
                </h2>

                {/* Quick action buttons */}
                <div className="mt-6 flex gap-3">
                    <ActionButton
                        icon={Phone}
                        label="Call"
                        onClick={() => window.open(`tel:${user.phone}`)}
                        primary
                    />
                    <ActionButton
                        icon={MessageSquare}
                        label="Message"
                        onClick={() => window.open(`sms:${user.phone}`)}
                    />
                    <ActionButton
                        icon={Video}
                        label="Video"
                        onClick={() => alert("Starting video call...")}
                    />
                    {user.email && (
                        <ActionButton
                            icon={Mail}
                            label="Email"
                            onClick={() => window.open(`mailto:${user.email}`)}
                        />
                    )}
                </div>
            </div>

            {/* Contact info */}
            <div className="flex-1 space-y-4 overflow-auto p-6">
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            <InfoRow label="Phone" value={formatPhone(user.phone)} href={`tel:${user.phone}`} />
                            {user.email && (
                                <InfoRow label="Email" value={user.email} href={`mailto:${user.email}`} />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 bg-transparent"
                        asChild
                    >
                        <Link to="/$userId/edit" params={{ userId: user.id }}>
                            <Pencil className="h-4 w-4" />
                            Edit Contact
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive bg-transparent"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Contact
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface ActionButtonProps {
    icon: React.ElementType
    label: string
    onClick: () => void
    primary?: boolean
}

function ActionButton({ icon: Icon, label, onClick, primary }: ActionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-1.5"
        >
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${primary
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
            >
                <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
        </button>
    )
}

interface InfoRowProps {
    label: string
    value: string
    href?: string
}

function InfoRow({ label, value, href }: InfoRowProps) {
    const content = (
        <>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium text-card-foreground">{value}</p>
        </>
    )

    if (href) {
        return (
            <a
                href={href}
                className="block px-4 py-3 transition-colors hover:bg-muted/50"
            >
                {content}
            </a>
        )
    }

    return <div className="px-4 py-3">{content}</div>
}
