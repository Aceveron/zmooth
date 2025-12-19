import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Printer, Send, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const invoiceTemplates = [
	{ id: "standard", name: "Standard Invoice" },
	{ id: "detailed", name: "Detailed Invoice" },
	{ id: "simple", name: "Simple Receipt" },
]

const sampleInvoices = [
	{ id: "INV-001", customer: "John Doe", amount: 1200, date: "2025-01-14" },
	{ id: "INV-002", customer: "Jane Smith", amount: 800, date: "2025-01-13" },
	{ id: "INV-003", customer: "Bob Wilson", amount: 1500, date: "2025-01-12" },
]

export default function PrintEmailPage() {
  const navigate = useNavigate()
	const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
	const [emailAddresses, setEmailAddresses] = useState("")
	const [subject, setSubject] = useState("Your Invoice from Zmooth WiFi")
	const [message, setMessage] = useState("Please find your invoice attached.")
	const [template, setTemplate] = useState("standard")
	const [includePaymentLink, setIncludePaymentLink] = useState(true)
	const [isProcessing, setIsProcessing] = useState(false)

	const handleInvoiceSelect = (invoiceId: string) => {
		setSelectedInvoices((prev) =>
			prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId],
		)
	}

	const handleSelectAll = () => {
		if (selectedInvoices.length === sampleInvoices.length) {
			setSelectedInvoices([])
		} else {
			setSelectedInvoices(sampleInvoices.map((inv) => inv.id))
		}
	}

	const handlePrint = () => {
		if (selectedInvoices.length === 0) {
			toast({
				title: "Error",
				description: "Please select at least one invoice to print",
				variant: "destructive",
			})
			return
		}

		window.print()
		toast({
			title: "Success",
			description: `${selectedInvoices.length} invoice(s) sent to printer!`,
		})
	}

	const handleEmail = async () => {
		if (selectedInvoices.length === 0) {
			toast({
				title: "Error",
				description: "Please select at least one invoice to email",
				variant: "destructive",
			})
			return
		}

		if (!emailAddresses.trim()) {
			toast({
				title: "Error",
				description: "Please enter at least one email address",
				variant: "destructive",
			})
			return
		}

		setIsProcessing(true)
		await new Promise((resolve) => setTimeout(resolve, 2000))
		setIsProcessing(false)

		toast({
			title: "Success",
			description: `${selectedInvoices.length} invoice(s) emailed successfully!`,
		})
	}

	const handleGeneratePDF = () => {
		if (selectedInvoices.length === 0) {
			toast({
				title: "Error",
				description: "Please select at least one invoice to generate PDF",
				variant: "destructive",
			})
			return
		}

		// Simulate PDF generation
		const pdfContent = selectedInvoices
			.map((id) => {
				const invoice = sampleInvoices.find((inv) => inv.id === id)
				return `Invoice: ${invoice?.id}\nCustomer: ${invoice?.customer}\nAmount: KES ${invoice?.amount}\nDate: ${invoice?.date}\n\n`
			})
			.join("")

		const blob = new Blob([pdfContent], { type: "text/plain" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `invoices-${Date.now()}.txt`
		a.click()
		URL.revokeObjectURL(url)

		toast({
			title: "Success",
			description: "PDF generated and downloaded successfully!",
		})
	}

	return (
		<div className="p-4 md:p-6">
			<div className="flex flex-col items-center justify-center gap-6">
				{/* Invoice Selection */}
				<Card className="glass border-brand-green/30 flex-1 max-w-xl w-full">
        	  		<CardHeader className="flex flex-col gap-4">
    	        		<div className="flex flex-row items-center justify-between w-full">
	              			<Button variant="ghost" className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => navigate(-1)}>
                				← Back
              				</Button>
              			<div className="flex-1 flex flex-col items-center">
							<CardTitle className="text-brand-green gap-2 flex items-center">
						    	<FileText className="h-5 w-5" />
								      Select Invoices
						    </CardTitle>
              			</div>
            			</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center space-x-2">
							<Checkbox
								id="selectAll"
								checked={selectedInvoices.length === sampleInvoices.length}
								onCheckedChange={handleSelectAll}
								className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
							/>
							<Label htmlFor="selectAll" className="text-brand-green">
								Select All ({sampleInvoices.length})
							</Label>
						</div>

						<div className="space-y-2">
							{sampleInvoices.map((invoice) => (
								<div
									key={invoice.id}
									className="flex items-center space-x-2 p-3 bg-brand-darkgray/30 rounded-lg"
								>
									<Checkbox
										id={invoice.id}
										checked={selectedInvoices.includes(invoice.id)}
										onCheckedChange={() => handleInvoiceSelect(invoice.id)}
										className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
									/>
									<div className="flex-1">
										<div className="font-medium text-white">{invoice.id}</div>
										<div className="text-sm text-white/70">{invoice.customer}</div>
										<div className="text-sm text-brand-green">
											KES {invoice.amount.toLocaleString()}
										</div>
									</div>
									<div className="text-sm text-white/60">{invoice.date}</div>
								</div>
							))}
						</div>

						<div className="space-y-2">
							<Label className="text-brand-green">Template</Label>
							<Select value={template} onValueChange={setTemplate}>
								<SelectTrigger className="bg-brand-darkgray border-brand-green/30 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="glass border-brand-green/30">
									{invoiceTemplates.map((tmpl) => (
								<SelectItem key={tmpl.id} value={tmpl.id}>
									{tmpl.name}
								</SelectItem>
								))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex gap-2">
							<Button
								onClick={handlePrint}
								variant="outline"
								className="flex-1 border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
							>
								<Printer className="h-4 w-4 mr-2" />
								Print
							</Button>
							<Button
								onClick={handleGeneratePDF}
								variant="outline"
								className="flex-1 border-brand-green/50 text-brand-green hover:bg-brand-green/10 bg-transparent"
							>
								<FileText className="h-4 w-4 mr-2" />
								Generate PDF
							</Button>
						</div>
					</CardContent>
				</Card>
				{/* Email Configuration*/}
				<Card className="glass border-brand-green/30 flex-1 max-w-xl w-full">
          			<CardHeader className="flex flex-col gap-4">
            			<div className="flex flex-row items-center justify-between w-full">
              			<div className="flex-1 flex flex-col items-center">
    						<CardTitle className="text-brand-green flex items-center gap-2">
		  			  			<Mail className="h-5 w-5" />
	    		  				Email Configuration
				    		</CardTitle>
              			</div>
            			</div>

					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="emails" className="text-brand-green">
								Email Addresses
							</Label>
							<Textarea
								id="emails"
								value={emailAddresses}
								onChange={(e) => setEmailAddresses(e.target.value)}
								placeholder="Enter email addresses (one per line or comma separated)"
								className="bg-brand-darkgray border-brand-green/30 text-white"
								rows={3}
							/>
							<p className="text-xs text-white/60">
								Separate multiple emails with commas or new lines
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subject" className="text-brand-green">
								Subject
							</Label>
							<Input
								id="subject"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								className="bg-brand-darkgray border-brand-green/30 text-white"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message" className="text-brand-green">
								Message
							</Label>
							<Textarea
								id="message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="bg-brand-darkgray border-brand-green/30 text-white"
								rows={4}
							/>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="paymentLink"
								checked={includePaymentLink}
								onCheckedChange={(checked) => setIncludePaymentLink(!!checked)}
								className="data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
							/>
							<Label htmlFor="paymentLink" className="text-white">
								Include payment link
							</Label>
						</div>

						<Button
							onClick={handleEmail}
							disabled={isProcessing}
							className="w-full bg-brand-green text-brand-black hover:bg-brand-neongreen"
						>
							{isProcessing ? (
								<>
									<Send className="h-4 w-4 mr-2 animate-pulse" />
									Sending...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Send Email ({selectedInvoices.length})
								</>
							)}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
