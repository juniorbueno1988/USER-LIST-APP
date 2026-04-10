import { UserService } from './user';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should return users', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBeGreaterThan(0);
    });
  });

  it('should create a user', () => {
    const newUser = {
      id: '3',
      name: 'Teste',
      email: 'teste@email.com',
      cpf: '333',
      phone: '7777',
      phoneType: 'mobile' as 'mobile'
    };

    service.createUser(newUser).subscribe(user => {
      expect(user.name).toBe('Teste');
    });
  });
});