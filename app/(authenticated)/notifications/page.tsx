import PageLayout from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotifications } from "../claims/actions";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <PageLayout title="Notifications" subtitle="Updates about your claims.">
      <Card>
        <CardHeader>
          <CardTitle>Recent notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              You have no notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="border-t p-4 first:border-t-0"
              >
                <p className="text-sm">{notification.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}