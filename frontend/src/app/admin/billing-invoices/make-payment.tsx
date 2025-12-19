import type React from "react"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Smartphone, Building2, Receipt, CheckCircle, Download, Printer, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function MakePaymentPage() {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [description, setDescription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(amount) < 1) {
      toast({
        title: "Error",
        description: "Amount must be at least 1 KES.",
        variant: "destructive",
      })
      return
    }
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Payment Successful",
      description: `Payment of KES ${amount} has been processed successfully!`,
    })

    // Reset form
    setAmount("")
    setPhoneNumber("")
    setCardNumber("")
    setExpiryDate("")
    setCvv("")
    setBankAccount("")
    setDescription("")
    setIsProcessing(false)
  }

  return (
    <div className="p-4 md:p-6">
      <Card className="glass border-brand-green/30 max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex flex-row items-center justify-between w-full">
            <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <CardTitle className="text-brand-green flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Make Payment
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-brand-green">
                Amount (KES)
              </Label>
              <Input
                id="amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-brand-darkgray border-brand-green/30 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-brand-green">
                Payment Method
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                <SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="glass border-brand-green/30">
                  <SelectItem value="mpesa">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      M-Pesa
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-brand-green">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                className="bg-brand-darkgray border-brand-green/30 text-white"
                required
              />
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-brand-green">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="bg-brand-darkgray border-brand-green/30 text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-brand-green">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiry"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      className="bg-brand-darkgray border-brand-green/30 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-brand-green">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="bg-brand-darkgray border-brand-green/30 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="space-y-2">
                <Label htmlFor="bankAccount" className="text-brand-green">
                  Bank Account Number
                </Label>
                <Input
                  id="bankAccount"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Enter bank account number"
                  className="bg-brand-darkgray border-brand-green/30 text-white"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description" className="text-brand-green">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment description..."
                className="bg-brand-darkgray border-brand-green/30 text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                type="submit"
                disabled={isProcessing || !paymentMethod || !amount}
                className="flex-1 min-w-0 px-2 py-2 text-sm bg-brand-green text-brand-black hover:bg-brand-neongreen"
              >
                {isProcessing ? "Processing..." : `Pay KES ${amount || "0"}`}
              </Button>
              <Button
                type="button"
                className="flex-1 min-w-0 px-2 py-2 text-sm bg-brand-green text-brand-black hover:bg-brand-neongreen"
                onClick={() => setShowConfirmation(true)}
              >
                Confirm Payment
              </Button>
            </div>
          </form>

          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-lg mx-auto p-0 mt-8">
                <Card className="glass border-brand-green/30 w-full mt-20">
                  <CardHeader className="text-center">
                    <div className="flex justify-between items-center mb-4">
                      <Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900" onClick={() => setShowConfirmation(false)}>
                        ← Back
                      </Button>
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    </div>
                    <CardTitle className="text-brand-green text-2xl">Payment Successful!</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-brand-darkgray/50 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Payment ID:</span>
                        <span className="font-mono text-brand-green">PAY-2025-001</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Amount:</span>
                        <span className="text-2xl font-bold text-brand-green">KES {amount || "0"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Payment Method:</span>
                        <span className="text-white">{paymentMethod || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Status:</span>
                        <Badge variant="success" className="capitalize">completed</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Date & Time:</span>
                        <span className="text-white">{new Date().toISOString().replace("T", " ").substring(0, 19)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Reference:</span>
                        <span className="font-mono text-white">MPE123456789</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-white/70">Description:</span>
                        <span className="text-white text-right">{description}</span>
                      </div>
                    </div>
                    <div className="bg-brand-darkgray/30 rounded-lg p-4">
                      <h3 className="text-brand-green font-semibold mb-3">Customer Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Name:</span>
                          <span className="text-white">-</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Email:</span>
                          <span className="text-white">-</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Phone:</span>
                          <span className="text-white">{phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => {
                          const receiptContent = `\nPayment Receipt\n===============\nPayment ID: PAY-2025-001\nAmount: KES ${amount || "0"}\nMethod: ${paymentMethod || "-"}\nStatus: completed\nDate: ${new Date().toISOString().replace("T", " ").substring(0, 19)}\nReference: MPE123456789\nDescription: ${description}\n\nCustomer Details:\nName: -\nEmail: -\nPhone: ${phoneNumber}\n    `;
                          const blob = new Blob([receiptContent], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `receipt-PAY-2025-001.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast({
                            title: "Success",
                            description: "Receipt exported successfully!",
                          });
                        }}
                        variant="outline"
                        className="flex-1 border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Export Receipt
                      </Button>
                      <Button variant="outline" className="flex-1 border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Receipt
                      </Button>
                    </div>
                    <div className="text-center text-sm text-white/60">
                      <p>Thank you for your payment!</p>
                      <p>A confirmation email has been sent to -</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
