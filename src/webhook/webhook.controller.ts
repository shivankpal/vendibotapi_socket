import { ItemsService } from './../items/items.service';
import { Controller, Get, Post, Req, Request, Res } from '@nestjs/common';
import { Webhook } from './webhook.entity';
@Controller('webhook')
export class WebhookController {
	constructor() {}

	@Post('paytm')
	async paytmWebhook(@Req() req: any, @Res() res: any) {
		const body = req.body;
		console.log(JSON.stringify(body));
		const webhook = new Webhook();
		webhook.data = JSON.stringify(body);
		await webhook.save();
		res.status(200).send(body);
	}

	@Get('data')
	async getData(@Req() req: any, @Res() res: any) {
		const result = await console.log();
		res.status(200).send({});
	}
}
