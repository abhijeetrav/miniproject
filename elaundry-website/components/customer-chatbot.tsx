"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const predefinedResponses = {
  greeting: "Hello! I'm your eLaundry assistant. How can I help you today?",
  services:
    "We offer Wash & Fold,Dry-cleaning pickup & Delivery. What service interests you?",
  pricing:
    "Our pricing is transparent: Wash & Fold starts at $15, Dry Cleaning at $25, and we offer pickup/delivery for just $5 extra.",
  pickup:
    "We offer convenient pickup and delivery! You can schedule a pickup through our 'Schedule Pickup' button. We operate Monday-Saturday, 8AM-6PM.",
  delivery:
    "Delivery typically takes 24-48 hours. You can track your order in real-time using our 'Track Delivery' feature.",
  hours: "We're open Monday-Saturday, 8AM-6PM. Pickup and delivery services are available during these hours.",
  contact: "You can reach us at +91-9696189283 or email support@elaundry.com. We're here to help!",
  quality:
    "We guarantee 100% satisfaction! If you're not happy with our service, we'll make it right or provide a full refund.",
  default:
    "I understand you're asking about our laundry services. Could you be more specific? I can help with services, pricing, pickup/delivery, or general questions.",
}

export function CustomerChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: predefinedResponses.greeting,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return predefinedResponses.greeting
    }
    if (message.includes("service") || message.includes("what do you offer")) {
      return predefinedResponses.services
    }
    if (message.includes("price") || message.includes("cost") || message.includes("how much")) {
      return predefinedResponses.pricing
    }
    if (message.includes("pickup") || message.includes("collect")) {
      return predefinedResponses.pickup
    }
    if (message.includes("delivery") || message.includes("deliver") || message.includes("track")) {
      return predefinedResponses.delivery
    }
    if (message.includes("hours") || message.includes("open") || message.includes("time")) {
      return predefinedResponses.hours
    }
    if (message.includes("contact") || message.includes("phone") || message.includes("email")) {
      return predefinedResponses.contact
    }
    if (message.includes("quality") || message.includes("guarantee") || message.includes("satisfaction")) {
      return predefinedResponses.quality
    }

    return predefinedResponses.default
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "What services do you offer?",
    "How much does it cost?",
    "How do I schedule pickup?",
    "What are your hours?",
  ]

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    handleSendMessage()
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Customer Care
              </CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-blue-700 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {message.sender === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="space-y-1">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-8"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
