import PageLayout from "@/components/page-layout";
import { MarkNotificationsRead } from "@/components/notifications/mark-notifications-read";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotificationFeed } from "../claims/actions";
import Link from "next/link";

export default async function NotificationsPage() {
  const notifications = await getNotificationFeed();

  return (
    <PageLayout title="Notifications" subtitle="Claim requests and claim status updates.">
      <MarkNotificationsRead />
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No claims.
            </p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className="flex gap-3 border-t p-4 first:border-t-0"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm">
                    {notification.message}
                    {notification.href ? (
                    <Link
                      href={notification.href}
                      className="ml-2 font-medium text-primary underline underline-offset-4"
                    >
                      {notification.linkLabel}
                    </Link>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  {notification.detail ? (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {notification.detail}
                    </p>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}