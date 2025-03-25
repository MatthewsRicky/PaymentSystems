"use client";

import { useState } from "react";
import Link from "next/link";

export default function PaymentPage(){
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
	const [paymentMethod, setPaymentMethod] = useState<string>("");
	const initiatePayment = async () => {
		setLoading(true);
		setError(null);
		setPaymentUrl(null);

		try {
			const response = await fetch("/api/pesapal/payments", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					amount: 100.0,
					currency:"KES",
					description: "Test payment",
					email:"kidematthews@gmail.com",
					phoneNumber: "+254704580875",
					paymentMethod,
				}),
			})

			const data= await response.json();
			if (!response.ok) throw new Error( data.error || "Payment failed.");
			setPaymentUrl(data.redirect_url);
			} catch(error) {
			setError((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 max-w-lg bg-white mx-auto shadow-lg rounded-lg">
			<h1 className="text-2xl font-bold mb-4">Choose Payment Method</h1>

			<select
				value={paymentMethod}
				onChange={(e) => setPaymentMethod(e.target.value)}
				className="w-full p-2 border rounded"
			>
				<option value="">Select Payment Method</option>
				<option value="M-Pesa">M-Pesa</option>
				<option value="Visa">Visa</option>
				<option value="PayPal">PayPal</option>
			</select>

			<button
				onClick={initiatePayment}
				disabled={loading || !paymentMethod}
				className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
			>
				{loading ? "Processing..." : "Pay Now"}
			</button>

			{error && <p className="mt-3 text-red-500">{error}</p>}

			{paymentUrl && (
				<div className="mt-4">
					<p className="text-blue-600">Payment Link Ready</p>
					<Link href={paymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Click Here to Pay</Link>
				</div>
			)}

		</div>
	)

}