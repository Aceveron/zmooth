"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

const items = [
	{ name: "Portal API", status: "Operational" },
	{ name: "RADIUS", status: "Operational" },
	{ name: "Payments", status: "Degraded" },
	{ name: "SMS", status: "Operational" },
]

export default function Page() {
	const navigate = useNavigate()

	return (
		<div className="p-4 md:p-6">
			<Button
				variant="ghost"
				size="sm"
				className="bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 mb-2 w-fit px-3"
				onClick={() => navigate(-1)}
			>
				← Back
			</Button>
			<div className="grid gap-4 md:grid-cols-2">
				{items.map((i) => (
					<Card key={i.name} className="glass border-brand-green/30">
						<CardHeader>
							<CardTitle className="text-brand-green">{i.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div
								className={`inline-flex rounded px-2 py-1 ${
									i.status === "Operational"
										? "bg-emerald-600/20"
										: "bg-amber-600/20"
								}`}
							>
								{i.status}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}