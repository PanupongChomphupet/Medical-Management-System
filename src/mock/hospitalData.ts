import type { Hospital } from '@/types/hospital'

export const hospitalData: Hospital[] = [
    {
        /* 436 ถ. รามคำแหง แขวงหัวหมาก บางกะปิ กรุงเทพมหานคร 10240 */
        id: '1',
        hospitalNameTh: 'โรงพยาบาลบางกะปิ',
        hospitalNameEn: 'BangKapi Hospital',
        initial: 'BKH',
        address: '436 ถ. รามคำแหง',
        subdistrict: 'หัวหมาก',
        district: 'บางกะปิ',
        province: 'กรุงเทพมหานคร',
        postalCode: '10240',
        status: 'Active',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
    },
    {
        /* 100 ตำบล ไผ่ล้อม อำเภอ บางกระทุ่ม พิษณุโลก 65110 */
        id: '2',
        hospitalNameTh: 'โรงพยาบาลบางกระทุ่ม',
        hospitalNameEn: 'Bangkrathum Hospital',
        initial: 'BGT',
        address: '100',
        subdistrict: 'ไผ่ล้อม',
        district: 'บางกระทุ่ม',
        province: 'พิษณุโลก',
        postalCode: '65110',
        status: 'Active',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
    },
    {
        /* ถนน โยธาธิการ เชียงราย 2096 แม่ลาว อำเภอแม่ลาว เชียงราย 57250 */
        id: '3',
        hospitalNameTh: 'โรงพยาบาลแม่ลาว',
        hospitalNameEn: 'Mae Laow Hospital',
        initial: 'MLW',
        address: 'ถนน โยธาธิการ',
        subdistrict: 'แม่ลาว',
        district: 'แม่ลาว',
        province: 'เชียงราย',
        postalCode: '57250',
        status: 'Inactive',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
    }

]
