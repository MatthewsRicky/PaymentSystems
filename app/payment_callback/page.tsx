'use client'

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const  pesapal_transaction_tracking_id  = searchParams.get('pesapal_transaction_tracking_id');
	const  pesapal_merchant_reference  = searchParams.get('pesapal_merchant_reference');


	useEffect(() => {
		if (pesapal_transaction_tracking_id && pesapal_merchant_reference) {
			// Optionally, call your /api/pesapal/query route here to get the final status
			const fetchPaymentStatus = async () => {
				try {
					const response = await fetch(`/api/pesapal/query?trackingId=${pesapal_transaction_tracking_id}`);
					const data = await response.json();
					console.log("Transaction Status", data);
					//handle data
				} catch(error){
					console.error("Error fetching payment status", error)
				}
			}
			fetchPaymentStatus()
			console.log('Pesapal Transaction ID:', pesapal_transaction_tracking_id);
			console.log('Merchant Reference:', pesapal_merchant_reference);
			// Update your UI to show a processing or success message
		} else {
			// Handle cases where the payment might have been cancelled or failed
			console.log('Payment callback without transaction details.');
		}
	}, [router, pesapal_merchant_reference, pesapal_transaction_tracking_id]);

	return (
		<div>
			<h1>Processing Payment...</h1>
			{pesapal_transaction_tracking_id && (
				<p>Transaction ID: {pesapal_transaction_tracking_id}</p>
			)}
			{pesapal_merchant_reference && (
				<p>Reference: {pesapal_merchant_reference}</p>
			)}
			<p>Please wait while we confirm your payment.</p>
			{/* You might want to add a button to redirect the user after a delay */}
		</div>
	);
}
