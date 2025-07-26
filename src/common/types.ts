type Shift = {
    days: (
        'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
    )[];
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
};

