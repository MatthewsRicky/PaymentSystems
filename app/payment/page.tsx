'use client';

import { useState } from 'react';

export default function PaymentPage() {
	const [amount, setAmount] = useState('');
	const [method, setMethod] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);

	const handlePayment = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/pesapal/payment/${method}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount,
					description,
					reference: `REF-${Date.now()}`,
				}),
			});

			const data = await res.json();

			// Optional: display response or redirect user
			console.log(data);
			if (data.redirectUrl) {
				window.location.href = data.redirectUrl;
			} else {
				alert('Payment initiated.');
			}

			// You might want to redirect to PesaPal iframe here if needed
		} catch (err) {
			console.error('Payment error:', err);
			alert("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-6 space-y-4">
			<h1 className="text-xl font-semibold">Make a Payment</h1>
			<input
				type="text"
				placeholder="Amount"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				className="w-full border rounded p-2"
			/>
			<input
				type="text"
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				className="w-full border rounded p-2"
			/>
			<select
				value={method}
				onChange={(e) => setMethod(e.target.value)}
				className="w-full border p-2 rounded"
			>
				<option value="mpesa">M-Pesa</option>
				<option value="visa">Visa</option>
				<option value="paypal">PayPal</option>
			</select>
			<button
				onClick={handlePayment}
				className="bg-blue-600 text-white px-4 py-2 rounded"
				disabled={loading}
			>
				{loading ? 'Processing...' : 'Pay Now'}
			</button>
		</div>
	);
}
