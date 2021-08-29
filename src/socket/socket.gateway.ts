import { SocketService } from './socket.service';
import { ItemsService } from './../items/items.service';
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Machines } from 'src/machine/machine.entity';

@WebSocketGateway({ cors: true })
export class SocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private itemService: ItemsService,
		private socketService: SocketService
	) {}

	@WebSocketServer() server;
	users = 0;

	afterInit(server: Server) {
		this.socketService.socket = server;
	}
	async handleConnection(client: any) {
		const authorization = client.handshake.headers.authorization;
		console.log(authorization)
		const code = authorization.split(' ')
		if(code.length===0) return 
		const machine = await Machines.findOne({ machine_id: code[1] })
		if (machine) {
			const machine_id = code[1]
			console.log('ROOM');
			client.join(`MACHINE${machine_id}`);
		}
	}
	async handleDisconnect(client: any) {
		client.leave('MACHINE1');
	}

	@SubscribeMessage('init-data')
	async onInitData(client: any, message: any) {
		const result = await this.itemService.getItems();
		client.emit('init-data-response', result);
	}

	@SubscribeMessage('init-payment')
	async onInitPayment(client: any, message: any) {
		const id = message.id;
		const result = await this.itemService.getPaytmQr(id);
		client.emit('init-payment-response', result);
	}

	@SubscribeMessage('init-cancel-transaction')
	async onCancelTransaction(client: any, message: any) {
		const order_id = message.order_id;
		const result = await this.itemService.cancelTransaction(order_id);
		client.emit('init-cancel-response', result);
	}

}
