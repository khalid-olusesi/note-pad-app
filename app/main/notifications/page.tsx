"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Bell, CheckCircle2, Clock, Notebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.getNotifications);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const router = useRouter();

  if (notifications === undefined) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-muted p-1.5 sm:p-2 rounded-lg">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </div>
            <h1 className="text-base sm:text-xl font-semibold">Notifications</h1>
          </div>
        </div>
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border bg-muted/10">
              <div className="mt-1">
                <Skeleton className="w-5 h-5 rounded-full" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-2/3 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleNotificationClick = (notification: { _id: string; isRead: boolean; relatedNoteId?: string }) => {
    if (!notification.isRead) {
      markAsRead({ notificationId: notification._id as Id<"notifications"> });
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "activity":
        return <Notebook className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-muted p-1.5 sm:p-2 rounded-lg">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </div>
          <h1 className="text-base sm:text-xl font-semibold">Notifications</h1>
        </div>
        
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer h-8 sm:h-10 px-2 sm:px-4 text-[11px] sm:text-sm"
          >
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4 mt-6">
        {notifications.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-muted/20 rounded-xl border border-dashed">
            <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-sm sm:text-base font-medium">No notifications yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">When you get reminders or activities, they will show up here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer hover:bg-muted/50 ${
                notification.isRead ? 'bg-background opacity-80' : 'bg-muted/20 border-purple-500/30'
              }`}
            >
              <div className="mt-1">
                {getIconForType(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs sm:text-sm font-medium ${notification.isRead ? 'text-foreground/80' : 'text-foreground'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {formatTime(notification.createdAt)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  {notification.message}
                </p>
              </div>

              {!notification.isRead && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-2"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
