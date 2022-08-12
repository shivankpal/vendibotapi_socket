import { SocketService } from './../socket/socket.service';
import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
	imports: [],
	controllers: [ItemsController],
	providers: [SocketService, ItemsService],
	exports: [ItemsService]
})
export class ItemsModule {}
