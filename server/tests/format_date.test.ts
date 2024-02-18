import { formatDate } from '../app';

describe('Testing formatDate()', () => {
    test('Format epoch 0', () => {
        const dateString: string = '01/01/1970 00:00:00';
        const date: Date = new Date(dateString);

        expect(formatDate(new Date(0))).toEqual(dateString);
        expect(date.getTime()).toEqual(0);
    });
    test('Format epoch 1708267593000', () => {
        const epoch: number = 1708267593000;
        const dateString: string = '18/02/2024 14:46:33';

        expect(formatDate(new Date(epoch))).toEqual(dateString);
    })
});