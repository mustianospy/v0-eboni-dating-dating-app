export class PushNotificationService {
  private static instance: PushNotificationService
  private registration: ServiceWorkerRegistration | null = null

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService()
    }
    return PushNotificationService.instance
  }

  async initialize(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported")
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered")
      return true
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return false
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission === "denied") {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  async subscribe(userId: string): Promise<string | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      return null
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      // Send subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          subscription: subscription.toJSON(),
        }),
      })

      return subscription.endpoint
    } catch (error) {
      console.error("Push subscription failed:", error)
      return null
    }
  }

  async sendNotification(title: string, body: string, icon?: string): Promise<void> {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: icon || "/icon-192x192.png",
        badge: "/icon-192x192.png",
      })
    }
  }
}
