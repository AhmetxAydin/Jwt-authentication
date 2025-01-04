import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    /* After the front-end is set, the url of the front-end can be entered here.
    In this way, the programme will only respond to requests from the url of the front-end.
    Since I am currently focusing only on the authentication part,
    assigned the url using the port value of the project in this section.*/
    origin : 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const appPort =  3001;
  await app.listen(appPort).then(() => {
    console.log(`Server is running on port ${appPort}`);
  });
}
bootstrap();