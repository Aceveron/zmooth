"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", content: "Hello! How can I help you with Zmooth Wifi today?" },
  ])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message to chat
    setChatHistory([...chatHistory, { role: "user", content: message }])

    // Clear input
    setMessage("")

    // Simulate bot response (this would be replaced with actual NLP/DialogFlow)
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't understand. Please contact our support team for assistance."

      // Simple keyword matching
      if (message.toLowerCase().includes("connect")) {
        botResponse =
          "To connect to Zmooth Wifi, please select a plan and complete the payment. You'll be connected automatically after successful payment."
      } else if (message.toLowerCase().includes("payment") || message.toLowerCase().includes("pay")) {
        botResponse = "We accept M-Pesa, Airtel Money, and credit/debit cards as payment methods."
      } else if (message.toLowerCase().includes("plan") || message.toLowerCase().includes("price")) {
        botResponse =
          "We offer various plans ranging from hourly (KES 5-10) to monthly (KES 500-3500). Please check our plans section for more details."
      } else if (message.toLowerCase().includes("help") || message.toLowerCase().includes("support")) {
        botResponse =
          "For technical support, please contact our team at support@zmoothwifi.com or call +254 745 437 063."
      }

      setChatHistory([...chatHistory, { role: "user", content: message }, { role: "bot", content: botResponse }])
    }, 1000)
  }

  return (
    <>
      {/* Chatbot Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={toggleChat}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-brand-green hover:bg-brand-neongreen text-brand-black shadow-neon"
        >
          {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 z-40 w-[calc(100%-2rem)] sm:w-80 md:w-96"
          >
            <Card className="shadow-lg glass border-brand-green/30 overflow-hidden">
              <CardHeader className="border-b border-brand-green/30 py-2 sm:py-3">
                <CardTitle className="text-base sm:text-lg flex items-center text-brand-green">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Zmooth Wifi Support
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 h-64 sm:h-80 overflow-y-auto bg-black/50">
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                          msg.role === "user"
                            ? "bg-brand-green text-brand-black shadow-neon-sm"
                            : "bg-brand-darkgray text-white border border-brand-green/30"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t border-brand-green/30 bg-black/50">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                    className="bg-brand-darkgray border-brand-green/30 text-white focus-visible:ring-brand-green text-xs sm:text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-brand-green text-brand-black hover:bg-brand-neongreen hover:shadow-neon"
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
