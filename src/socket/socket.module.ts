import { SocketService } from './socket.service';
import { ItemsService } from './../items/items.service';
import { Module, Global } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Global()
@Module({
	controllers: [],
	providers: [SocketGateway, ItemsService, SocketService],
	exports: [SocketService]
})
export class SocketModule {}
