import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./modules/app/app.module";
import { AllExceptionsFilter } from "@core/exception-filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: true, // allows all domains
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  const port = process.env.PORT || 8080;

  const config = new DocumentBuilder()
    .setTitle("Aviearo")
    .setDescription("Aviearo API description")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "authorization" // This is the name of the security definition
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger-api", app, document);

  await app.listen(port, async () => {
    console.log(
      `The server is running on ${port} port: http://localhost:${port}/api/swagger-api`
    );
  });
}
bootstrap();
