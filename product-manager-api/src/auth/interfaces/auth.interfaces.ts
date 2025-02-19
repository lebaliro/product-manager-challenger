export interface User {
  id: number;
  apikey: string;
  cpf: string;
  createAt: Date;
  updateAt: Date;
}

export interface RequestUser extends Request {
  user?: User;
}
