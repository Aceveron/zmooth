"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

export default function Page() {
  const navigate = useNavigate()
  return (
    <div className="p-4 md:p-6 flex items-center justify-center min-h-screen">
      <Card className="glass border-brand-green/30 max-w-import { useNavigate } from 'react-router-dom'
2xl">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 mb-2 w-fit px-3"
            onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <CardTitle className="text-brand-green">Help Center (FAQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I buy a voucher?</AccordionTrigger>
              <AccordionContent>Go to Purchase, select a plan, and follow prompts.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why is my speed slow?</AccordionTrigger>
              <AccordionContent>Check your plan bandwidth and current usage.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I connect multiple devices?</AccordionTrigger>
              <AccordionContent>Depends on your plan’s device limit.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
