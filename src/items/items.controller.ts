import { Controller, Get, Post, Req, Request, Res } from '@nestjs/common';
import { Items } from './items.entity';

@Controller('items')
export class ItemsController {
	//constructor() {}

	@Post('paytm')
	async paytmWebhook(@Req() req: any, @Res() res: any) {
		const body = req.body;
		// const webhook = new Items();
		// webhook.data = JSON.stringify(body);
		// await webhook.save();
		res.status(200).send(body);
	}
}
