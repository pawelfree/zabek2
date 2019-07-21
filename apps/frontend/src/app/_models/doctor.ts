export class Doctor {
    id: number;
    firstName: string;
    lastName: string;
	pesel?: string;
	officeName: string;    
    officeAddress?: string;
    qualificationsNo: string;
	officeCorrAddress?: string;
	examFormat?: string; // tutaj powinna być tablica opcji
    active: boolean;
    tomographyWithViewver: boolean;
}