import SendNotificationForm from "@/components/send-notification-form"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Notification</h2>
      <SendNotificationForm />
    </div>
  )
}
