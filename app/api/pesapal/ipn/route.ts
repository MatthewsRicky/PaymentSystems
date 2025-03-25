import { NextResponse} from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log("Pesapal IPN Recieved", body); // debugging

		const { order_tracking_id } = body;

		//step: 1 Verify the transaction status with Pesapal
		const verificationUrl = `${process.env.PESAPAL_API_URL}/Transactions/GetTransactionStatus?orderTrackingId=${order_tracking_id}`;
		const response = await fetch(verificationUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.PESAPAL_API_URL}`, //Get a fresh token first
			}
		})

		const verificationData = await response.json();
		console.log("Verification Data", verificationData);
		if (verificationData.status === "Completed") {
			console.log("Payment Successful", verificationData);
			// Step 2: Update Database (Example)
			//await db.updateTransaction(transaction_reference, {status: 'Paid"})
		} else {
			console.log("Payment Not Completed: ", verificationData);
		}
		return NextResponse.json({ message: "IPN Processed"})
	} catch (error) {
		console.error("IPN Error: ", error);
		return NextResponse.json({ error: "Error Processing IPN"}, {status: 500})
	}
}