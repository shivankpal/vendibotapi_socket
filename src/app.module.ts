import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookModule } from './webhook/webhook.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
	imports: [		
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true
		}),
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
		WebhookModule,
		UsersModule,
		AuthModule

	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
