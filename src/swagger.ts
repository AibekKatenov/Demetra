import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as pkg from '../package.json'
import { config } from './config'
import { INestApplication } from '@nestjs/common'

export default (app: INestApplication) => {
	const swaggerConfig = new DocumentBuilder()
		.setTitle(pkg.name)
		.setDescription(pkg.description)
		.setVersion(pkg.version)
		.setContact(pkg.author, "none", pkg.email)
		.addBearerAuth({
			type: 'http',
			description: 'Can be received at `/auth/login` endpoint',
			name: 'Authorization',
			in: '/api/auth/login',
		})
		.build()
	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup(`${config.swagger.path}`, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	})
}
