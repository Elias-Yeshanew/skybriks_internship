export interface Intern {
    id?: number;
    internIdStr?: string;
    name: string;
    email: string;
    phone: string;
    idCardType: 'Free' | 'Premium';
    joiningDate: string;
    batch: { id: number };
}