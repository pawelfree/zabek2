import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  xit('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
