import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookModule } from './webhook/webhook.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
	imports: [
		ScheduleModule.forRoot(),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: '127.0.0.1',
			port: 3306,
			username: 'root',
			//password: 'Vendibot@0601',
			password: 'shivank89#',
			database: 'vendibot',
			entities: ['dist/**/*.entity{.ts,.js}'],
			synchronize: true
		}),
		SocketModule,
		WebhookModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
