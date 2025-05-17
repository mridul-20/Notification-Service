import NotificationsList from "@/components/notifications-list"

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">View Notifications</h2>
      <NotificationsList />
    </div>
  )
}
