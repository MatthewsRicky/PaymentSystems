'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentForm() {
	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('Product Purchase');
	const router = useRouter();
	const [callbackUrl, setCallbackUrl] = useState('');

	useEffect(() => {
		// In a real app, this should be an absolute URL
		setCallbackUrl(`${window.location.origin}/payment-callback`);
	}, []);


	const handlePayment = async () => {
		try {
			// const callbackUrl = `${window.location.origin}/payment-callback`; // Define your callback URL
			const notificationId = Math.random().toString(36).substring(7); // Generate a unique ID

			const response = await fetch('/api/pesapal/initialize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount,
					currency: 'KES', // Or your desired currency
					description,
					callback_url: callbackUrl,
					notification_id: notificationId,
				}),
			});

			const data = await response.json();

			if (data.redirectUrl) {
				window.location.href = data.redirectUrl;
			} else {
				console.error('Pesapal initialization failed:', data.error);
				// Handle error on the frontend
				alert(`Payment initialization failed: ${data.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error initiating payment:', error);
			if (error instanceof Error) {
				alert(`Error initiating payment: ${error.message}`);
			} else {
				alert('Error initiating payment: An unknown error occurred');
			}
			// Handle error on the frontend
		}
	};

	return (
		<div>
			<h2>Make Payment</h2>
			<input
				type="number"
				placeholder="Amount"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
			/>
			<button onClick={handlePayment} disabled={!amount}>
				Pay Now
			</button>
		</div>
	);
}