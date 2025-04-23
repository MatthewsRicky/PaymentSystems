// app/api/pesapal/ipn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
	try {
		const { order_tracking_id, merchant_reference } = await req.json();

		if (!order_tracking_id || !merchant_reference) {
			return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
		}

		// STEP 1: Get Auth Token
		const tokenRes = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/pesapal/token`);
		const token = tokenRes.data.token;

		// STEP 2: Query Payment Status
		const queryUrl = `${process.env.PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${order_tracking_id}`;

		const statusRes = await axios.get(queryUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/json',
			},
		});

		const statusData = statusRes.data;

		console.log('[PESAPAL IPN] Status Data:', statusData);

		// STEP 3: Update DB (pseudocode)
		// await db.updateTransaction(merchant_reference, {
		//   status: statusData.payment_status,
		//   order_tracking_id,
		// });

		return NextResponse.json({ received: true, status: statusData.payment_status });
	} catch (error) {
		console.error('[PESAPAL IPN ERROR]', error);
		return NextResponse.json({ error: 'Internal error' }, { status: 500 });
	}
}
