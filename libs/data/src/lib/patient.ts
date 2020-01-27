// na razie nie potrzebujemy takiego obiektu, 
// ale moim zdaniem lepiej tworzyć juz rekordy pacjentów, o ułatwi pracętechnikowi rtg
export class Patient {
    id: number;
    firstName: string;
    lastName: string;
	pesel?: string;
	email?: string;    
    phone?: string; 	
    active: boolean;	
}