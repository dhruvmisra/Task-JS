const fetch = require('node-fetch');

const OAuthURL = "https://5f79b6b0e402340016f93317.mockapi.io/api/bills/oauth";
const fetchBillURL = "https://5f79b6b0e402340016f93317.mockapi.io/api/bills/fetchBill";
const fetchReceiptURL = "https://5f79b6b0e402340016f93317.mockapi.io/api/bills/fetchReceipt";
const USERNAME = "abcde";
const PASSWORD = "qwejkhnkacjnqei"

class RemoteHandler {
	constructor() {}

	fetch_bill(customerIdentifiers) {
		return fetch(OAuthURL, {
			method: "post",
			body: {
				username: USERNAME,
				password: PASSWORD
			}
		})
			.then(res => res.json())
			.then(json => {
				let authHeader = 'Bearer ' + json.token;
				return fetch(fetchBillURL, {
					method: "post",
					headers: {
						'Authorization': authHeader
					},
					body: {
						loanNumber: customerIdentifiers[0]['value']
					}
				});
			})
			.then(res => res.json())
			.then(json => {
				const response = {
					amount: json.amount * 100.0,
					billNumber: "None",
					billPeriod: "MONTHLY",
					customerName: json.customerName,
					approvalRefNum: "approvalRefNum",
					billDate: "None",
					dueDate: "None",
					AdditionalInfo: "None"
				}

				return response;
			})
			.catch(err => {
				console.log(err);
			})
	}


	update_payment(customerIdentifiers, billNumber, amount, txn_id, payment_method) {
		return fetch(OAuthURL, {
			method: "post",
			body: {
				username: USERNAME,
				password: PASSWORD
			}
		})
			.then(res => res.json())
			.then(json => {
				let authHeader = 'Bearer ' + json.token;

				return fetch(fetchReceiptURL, {
					method: "post",
					headers: {
						'Authorization': authHeader
					},
					body: {
						amountPaid: amount,
						loanNumber: customerIdentifiers[0]['value'],
						txn_id: txn_id,
						payment_method: payment_method
					}
				})
			})
			.then(res => res.json())
			.then(json => {
				return json.acknowledged;
			})
			.catch(err => {
				console.log(err);
			})
	}
}


const obj = new RemoteHandler();

obj.fetch_bill([{ 'name': 'Loan Number', 'value': '000123' }])
	.then(bill => {
		console.log(bill);
	})


obj.update_payment([{ 'name': 'Loan Number', 'value': '000123' }], 123, 1000, "abc", "UPI")
	.then(receipt => {
		console.log(receipt);
	})




/*
Gandharva Bettadapur3:40 PM
[{'name':'Loan Number', 'value':'000123'}]

{
		"amount": "1000", # in paisa
		"billNumber": None,
		"billPeriod": "MONTHLY",
		"customerName": "Ashok",
		"approvalRefNum": "approvalRefNum",
		"billDate": None,
		"dueDate": None,
		"AdditionalInfo": None
}
Gandharva Bettadapur3:41 PM
API response- {
		"id": "77",
		"loanNumber": "000123",
		"customerName": "Kennedy Rau",
		"amount": "79.83",
		"billDate": "2020-01-15T07:40:18.271Z"
}

*/