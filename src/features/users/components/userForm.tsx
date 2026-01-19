import { z } from 'zod';
import { UserAvatar } from "./userAvatar";
import type { User } from "../models.users";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/useAppForm";

const createUserSchema = z.object({
    phone: z.e164("Please enter a valid phone number").min(1, 'Phone is required'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required').nullable(),
    email: z.email('Please enter a valid email address').nullable(),
    avatar: z.url('Please enter a valid URL for the avatar').nullable(),
})

type CreateUserForm = z.infer<typeof createUserSchema>
interface UserFormProps {
    user?: User
    onSubmit: (user: CreateUserForm) => (unknown | Promise<unknown>)
    onReset?: () => unknown
}

export const UserForm = ({ user, onSubmit: onSubmitFn, onReset }: UserFormProps) => {
    const form = useAppForm({
        defaultValues: {
            phone: user?.phone ?? '',
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? null,
            email: user?.email ?? null,
            avatar: user?.avatar ?? null,
        } satisfies CreateUserForm,
        validators: {
            onBlur: createUserSchema,
        },
        onSubmit: ({ value }) => {

            console.log("ON SUBMIT FIRED", value)
            onSubmitFn(value)
            console.log("ON SUBMIT FIRED")
        }, onSubmitInvalid(props) {
            console.log("ON SUBMIT INVALID FIRED", props.formApi.getAllErrors())
        },
    })

    const isEditing = !!user

    return (
        <div className="flex h-full flex-col bg-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <Button variant="ghost" size="sm" type="reset" form='user-form'>
                    Cancel
                </Button>
                <h2 className="font-semibold text-card-foreground">
                    {isEditing ? "Edit Contact" : "New Contact"}
                </h2>
                <Button size="sm" type="submit" form='user-form'>
                    {isEditing ? "Save" : "Done"}
                </Button>
            </div>

            {/* Form */}
            <form className="flex-1 overflow-auto" id='user-form'
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                onReset={(e) => { e.preventDefault(); e.stopPropagation(); form.reset(); onReset?.() }}
            >
                {/* Avatar preview */}
                <div className="flex flex-col items-center py-8">
                    {isEditing ? (
                        <UserAvatar
                            avatar={form.getFieldValue("avatar") ?? undefined}
                            firstName={form.getFieldValue("first_name") || "N"}
                            lastName={form.getFieldValue("last_name") || "N"}
                            size="xl"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <span className="text-3xl text-muted-foreground">+</span>
                        </div>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">
                        {`${form.getFieldValue("first_name")} ${form.getFieldValue("last_name")}`.trim()}
                    </p>
                </div>

                {/* Input fields */}
                <div className="space-y-6 px-6 pb-6">
                    <div className="space-y-4 rounded-lg bg-muted/30 p-4">
                        <form.AppField name="first_name">
                            {(field) => <field.TextField label="First name" placeholder="First name" />}
                        </form.AppField>
                        <form.AppField name="last_name">
                            {(field) => <field.TextField label="Last name" placeholder="Last name" />}
                        </form.AppField>
                    </div>

                    <div className="space-y-4 rounded-lg bg-muted/30 p-4">
                        <form.AppField name="phone">
                            {(field) => <field.PhoneField label="Phone" placeholder="Phone" />}
                        </form.AppField>
                        <form.AppField name="email">
                            {(field) => <field.TextField label="Email" placeholder="Email" />}
                        </form.AppField>
                    </div>
                </div>
            </form>
        </div>
    )
}
