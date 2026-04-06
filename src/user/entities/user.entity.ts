export class User {
    id: number;
    username: string; 
    email: string; 
    password: string;
    role: 'user' | 'admin';
    cvIds: number[];
    createdAt: Date;
    updatedAt: Date;
}
