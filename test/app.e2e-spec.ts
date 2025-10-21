import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { AuthModule } from '../src/auth.module';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

describe('AuthController (e2e)', () => {
  let app: INestMicroservice;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 5000
      }
    });
    await app.listen();

    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 5000
      }
    })

    await client.connect();
  });

  afterAll(async() => {
    if (client) await client.close();
    if (app) await app.close();
  })

  it('Should register a user', async () => {
    const user = {name: "test200", email: "test200@gmail.com", password: "test200123"};

    const result = await firstValueFrom(client.send({cmd: "user_register"}, user));

    expect(result.success).toEqual(true);
    expect(result.message).toEqual("Usuario guardado exitosamente");
    expect(result.data).toEqual(expect.objectContaining({name:user.name, email: user.email}));
  })

  it('Should send a error message when the user email already exist', async () => {
    const user = {name: "test200", email: "test200@gmail.com", password: "test200123"};

    try {
      const result = await firstValueFrom(client.send({cmd: "user_register"}, user));
      fail("El registro de un usuario no lanzó un error como se esperaba");
    } catch (error) {
      expect(error.success).toEqual(false);
      expect(error.message).toEqual("El email ya se encuentra en uso");
    }
  })

  it('Should send a success message to login a user', async () => {
    const user = {email: "test200@gmail.com", password: "test200123"};

    const result = await firstValueFrom(client.send({cmd: "user_login"}, user));

    expect(result.success).toEqual(true);
    expect(result.message).toEqual("Usuario logueado exitosamente");
  });

  it('Should send a error message to login a user', async () => {
    const user = {email: "test200@gmail.com", password: "test100123"};

    try {
      await firstValueFrom(client.send({cmd: "user_login"}, user));
      fail('El login de un usuario no falló como se esperaba');
    } catch (error) {
      expect(error.error.success).toEqual(false);
      expect(error.error.message).toEqual("Verifique sus credenciales");
    }
  });

  it('Should send a error message when the user doesn´t exist', async () => {
    const user = {email: "test101@gmail.com", password: "test101123"};

    try {
      await firstValueFrom(client.send({cmd: "user_login"}, user));
      fail("El login de un usuario no falló como se esperaba");
    } catch (error) {
      expect(error.success).toEqual(false);
      expect(error.message).toEqual("Usuario no encontrado");
    }
  })

});
