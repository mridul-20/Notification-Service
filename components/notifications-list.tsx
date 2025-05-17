"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Search, Mail, MessageSquare, Smartphone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
})

type FormValues = z.infer<typeof formSchema>

type Notification = {
  id: string
  userId: string
  type: "EMAIL" | "SMS" | "IN_APP"
  subject?: string
  message: string
  timestamp: string
}

export default function NotificationsList() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/users/${data.userId}/notifications`)

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const notificationsData = await response.json()
      setNotifications(notificationsData)

      if (notificationsData.length === 0) {
        toast({
          title: "No notifications found",
          description: `User ${data.userId} has no notifications`,
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications. Please try again.",
        variant: "destructive",
      })
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return <Mail className="h-5 w-5 text-blue-500" />
      case "SMS":
        return <Smartphone className="h-5 w-5 text-green-500" />
      case "IN_APP":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "EMAIL":
        return "bg-blue-100 text-blue-800"
      case "SMS":
        return "bg-green-100 text-green-800"
      case "IN_APP":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Fetch User Notifications</CardTitle>
          <CardDescription>Enter a user ID to view their notifications</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input placeholder="Enter user ID" {...field} />
                      </FormControl>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          "Loading..."
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Fetch
                          </>
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && hasSearched && notifications.length === 0 && (
        <Card className="shadow-sm bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
            <p className="text-gray-500 mt-1">This user doesn't have any notifications yet.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {getNotificationIcon(notification.type)}
                    <Badge className={getNotificationColor(notification.type)}>{notification.type}</Badge>
                    {notification.subject && <span className="font-medium">{notification.subject}</span>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(notification.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
