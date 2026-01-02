"use client"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex bg-primary-theme flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </div>
    )
}
