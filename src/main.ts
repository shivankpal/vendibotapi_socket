import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 5001;
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	
	await app.listen(port, () => {
		console.log(`Running on post ${port} on process ${process.pid}`);
	});
}
bootstrap();
