import { SocketService } from './../socket/socket.service';
import { Credential } from './credential.entity';
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-var */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { MachineItems } from '../machine/machine-items.entity';
import { Payment } from './payment.entity';
import { request } from 'express';
import { TransactionStatus, TransactionType } from './common.enum';
import { Machines } from 'src/machine/machine.entity';

const PaytmChecksum = require('paytmchecksum');
@Injectable()
export class ItemsService {
	constructor(private readonly socketService: SocketService) { }
	private readonly logger = new Logger(ItemsService.name);
	async getItems() {
		const result = await getConnection()
			.createQueryBuilder()
			.select(
				'i.title, i.image, i.rawimage, i.description, i.code, mi.id, mi.price'
			)
			.from('machine_items', 'mi')
			.leftJoin('items', 'i', 'i.id=mi.item_id')
			.where('mi.machine_id = :machineID AND i.id is NOT NULL', {
				machineID: 1
			})
			.getRawMany();
		return result;
	}
	async getItem(id: number) {
		const result = await MachineItems.findOne({ id: id });
		return result;
	}

	async getCred(machineId: number) {
		const result = await getConnection()
			.createQueryBuilder()
			.select('c.*')
			.from('machine_credential', 'mc')
			.leftJoin('credentials', 'c', 'c.id = mc.credential_id')
			.where('mc.machine_id = :machineID AND c.id is NOT NULL', {
				machineID: machineId
			})
			.getRawOne();
		return result;
	}

	async getPaytmQr(id: number) {
		const orderId = uuidv4();
		const response = await this.getItem(id);
		if (response.machine_id) {
			const cred = await this.getCred(response.machine_id);
			const option: any = {};
			option.body = {
				mid: cred.mid,
				orderId: orderId,
				amount: response.price,
				businessType: 'UPI_QR_CODE',
				posId: 'S12_123'
			};
			const checksum = await PaytmChecksum.generateSignature(
				JSON.stringify(option.body),
				cred.key
			);
			option.head = {
				clientId: 'C112',
				version: 'v1',
				signature: checksum
			};
			const postdata = JSON.stringify(option);
			const payment = new Payment();
			payment.machine_id = response.machine_id;
			payment.item_id = response.item_id;
			payment.order_id = orderId;
			payment.price = response.price;
			payment.request = postdata;
			const orderdata = await payment.save();
			const qrdata = await this.generateQr(postdata);
			this.checkTransactionStatus(orderId);
			return { qrdata, orderdata };
		}
	}

	async generateQr(postdata: string) {
		const payurl = `https://securegw.paytm.in/paymentservices/qr/create`;
		const header = {
			'Content-Type': 'application/json'
		};
		try {
			const response = await axios.post(payurl, postdata, {
				headers: header
			});
			if (response.status === 200) {
				return { status: 200, data: response.data, message: 'success' };
			}
		} catch (err) {
			return {
				status: err.response.status,
				data: null,
				message: err.message
			};
		}
	}

	// @Cron('*/30 * * * * *')
	// async handleCron() {
	// 	const result = await Payment.find({
	// 		where: [
	// 			{ status: PaytmTransactionStatus.PENDING },
	// 			{ status: PaytmTransactionStatus.CANCEL }
	// 		]
	// 	});
	// 	result.reverse();
	// 	console.log(result.length);
	// 	result.forEach(async (value: any) => {
	// 		const req = JSON.parse(value.request);
	// 		const { mid } = req.body;
	// 		//console.log(req.body);
	// 		if (mid) {
	// 			const cred = await Credential.findOne({ mid: mid });
	// 			const paytmParams: any = {};

	// 			paytmParams.body = {
	// 				mid: mid,
	// 				orderId: value.order_id
	// 			};
	// 			const checksum = await PaytmChecksum.generateSignature(
	// 				JSON.stringify(paytmParams.body),
	// 				cred.key
	// 			);
	// 			paytmParams.head = {
	// 				signature: checksum
	// 			};
	// 			const payurl = `https://securegw.paytm.in/v3/order/status`;
	// 			const header = {
	// 				'Content-Type': 'application/json'
	// 			};
	// 			try {
	// 				const response = await axios.post(
	// 					payurl,
	// 					JSON.stringify(paytmParams),
	// 					{
	// 						headers: header
	// 					}
	// 				);
	// 				//console.log(response.status, value.order_id);
	// 				if (response.status === 200) {
	// 					await Payment.update(
	// 						{ id: value.id },
	// 						{
	// 							response: JSON.stringify(response.data),
	// 							status: response.data.body.resultInfo
	// 								.resultStatus
	// 						}
	// 					);
	// 					const socket = this.socketService.socket;
	// 					socket
	// 						.to(`MACHINE${value.machine_id}`)
	// 						.emit('messages', 'Hello from REST API');
	// 				}
	// 			} catch (err) {
	// 				console.log(err.message);
	// 			}
	// 		}
	// 	});
	// 	// this.logger.debug(
	// 	// 	`Called when the current second is ${new Date().getTime()}`
	// 	// );
	// }

	async checkTransactionStatus(orderId: string) {
		await new Promise((r) => setTimeout(r, 5000));
		const result = await Payment.findOne({ order_id: orderId, status: TransactionStatus.PENDING, type: TransactionType.ONLINE });
		if (result) {
			const req = JSON.parse(result.request);
			const { mid } = req.body;
			//console.log(req.body);
			if (mid) {
				const cred = await Credential.findOne({ mid: mid });
				const paytmParams: any = {};

				paytmParams.body = {
					mid: mid,
					orderId: result.order_id
				};
				const checksum = await PaytmChecksum.generateSignature(
					JSON.stringify(paytmParams.body),
					cred.key
				);
				paytmParams.head = {
					signature: checksum
				};
				const payurl = `https://securegw.paytm.in/v3/order/status`;
				const header = {
					'Content-Type': 'application/json'
				};
				try {
					const response = await axios.post(
						payurl,
						JSON.stringify(paytmParams),
						{
							headers: header
						}
					);
					//console.log(response.status, value.order_id);
					if (response.status === 200) {
						await Payment.update(
							{ id: result.id },
							{
								response: JSON.stringify(response.data),
								status: response.data.body.resultInfo
									.resultStatus
							}
						);
						const socket = this.socketService.socket;
						console.log(socket.sockets.adapter.rooms);
						if (
							response.data.body.resultInfo.resultStatus ===
							TransactionStatus.TXN_SUCCESS ||
							response.data.body.resultInfo.resultStatus ===
							TransactionStatus.TXN_FAILURE
						) {
							const orderdata = await Payment.findOne(
								{ id: result.id }
							);
							const machine = await Machines.findOne({ id: result.machine_id  })
							const machine_id = machine.machine_id
							console.log(`push to room MACHINE_${machine_id}`)
							socket
								.to(`MACHINE_${machine_id}`)
								.emit('transaction-response', {
									orderdata: orderdata
								});
						}

						const recheck = await Payment.findOne({
							order_id: orderId
						});
						console.log('recheck', recheck);
						if (recheck.status === TransactionStatus.PENDING) {
							this.checkTransactionStatus(orderId);
						}
					}
				} catch (err) {
					console.log(err.message);
				}
			}
		}
	}

	async getOrderById(orderId: string) {
		await Payment.find(
			{ order_id: orderId },
		);
	}

	async cancelTransaction(orderId: string) {
		await Payment.update(
			{ order_id: orderId },
			{ status: TransactionStatus.CANCEL }
		);
	}
}
