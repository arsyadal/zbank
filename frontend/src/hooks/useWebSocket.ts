'use client'

import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import toast from 'react-hot-toast'

export function useWebSocket(accountNumber: string | undefined) {
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!accountNumber) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/transactions/${accountNumber}`, (message) => {
          try {
            const event = JSON.parse(message.body)
            const status = event.status as string
            const amount = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(event.amount)

            if (status === 'COMPLETED') {
              const isIncoming = event.destinationAccount === accountNumber
              toast.success(
                isIncoming
                  ? `Received ${amount} from ${event.sourceAccount}`
                  : `Transfer ${amount} completed`,
                { duration: 5000 }
              )
            } else if (status === 'FAILED') {
              toast.error(`Transaction failed: ${event.failureReason || 'Unknown error'}`, {
                duration: 5000,
              })
            }
          } catch {
            // ignore parse errors
          }
        })
      },
      onStompError: () => {
        // silent - backend may not have WS if not running
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [accountNumber])
}
