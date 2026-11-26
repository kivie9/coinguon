/**
 * Bộ sinh dữ liệu gia phả mẫu 10 đời cho Lê Tộc Đại Tôn.
 * Xác định (deterministic): chạy nhiều lần luôn ra cùng một cây phả hệ.
 * Dùng chung cho dữ liệu dự phòng (không cần CSDL) và seed CSDL.
 */

export interface LePerson {
    key: string;
    fullName: string;
    gender: 'Male' | 'Female';
    generation: number;
    /** 1 = Chi Trưởng, 2 = Chi 2, 3 = Chi 3 */
    branchIndex: number;
    fatherKey: string | null;
    motherKey: string | null;
    spouseKey: string | null;
    birthOrder: number;
    /** Thuộc dòng trưởng nam (đích tôn) */
    isChief: boolean;
    isAlive: boolean;
    birthYear: number;
    deathYear: number | null;
    birthdaySolar: string;
    birthdayLunar: string;
    deathDateSolar: string | null;
    deathDayLunar: string | null;
    roleTitle: string;
    courtesyName: string | null;
    duties: string | null;
    burialPlace: string | null;
    residence: string | null;
    ancestralOrigin: string;
    phone: string | null;
    email: string | null;
    academicLevel: string | null;
    bio: string;
}

export interface LeFamily {
    people: LePerson[];
    anchors: {
        founder: string;
        founderWife: string;
        truongChi: string;
        tocTruong: string;
        phoBanTriSu: string;
        chauDichTon: string;
    };
}

const CURRENT_YEAR = 2026;
const LAST_BIRTH_YEAR = 2025;
const ORIGIN = 'Làng Mộ Trạch, Bình Giang, Hải Dương';

const RESERVED_NAMES = [
    'Lê Văn Quang',
    'Trần Thị Lụa',
    'Lê Văn Phúc',
    'Phạm Thị Mai',
    'Lê Văn Thọ',
    'Lê Văn Đạt',
    'Lê Thị Bình',
    'Lê Thị Lan',
    'Lê Văn Khang',
    'Lê Văn Thịnh',
    'Lê Văn Minh',
];

const MALE_MIDDLES = ['Văn', 'Văn', 'Văn', 'Hữu', 'Đình', 'Xuân', 'Đức', 'Công', 'Ngọc', 'Bá'];
const MALE_GIVEN = [
    'An', 'Bảo', 'Cường', 'Dũng', 'Đạt', 'Giang', 'Hải', 'Hiếu', 'Hoàng', 'Hưng',
    'Huy', 'Khoa', 'Kiên', 'Lâm', 'Long', 'Nam', 'Nghĩa', 'Phong', 'Quân', 'Sơn',
    'Tài', 'Thắng', 'Thành', 'Toàn', 'Trí', 'Tú', 'Việt', 'Vinh', 'Vũ', 'Bình',
    'Đông', 'Hùng', 'Lộc', 'Nhân', 'Phước', 'Tâm', 'Thiện', 'Thuận', 'Tiến', 'Dương',
];
const FEMALE_MIDDLES_OLD = ['Thị'];
const FEMALE_MIDDLES_NEW = ['Thị', 'Ngọc', 'Thu', 'Phương', 'Thùy', 'Hồng', 'Bảo'];
const FEMALE_GIVEN = [
    'Lan', 'Huệ', 'Cúc', 'Nga', 'Hạnh', 'Hương', 'Liên', 'Loan', 'Nhung', 'Oanh',
    'Phượng', 'Thảo', 'Thúy', 'Trang', 'Vân', 'Yến', 'Linh', 'Ngân', 'Hà', 'Mỹ',
    'Dung', 'Hiền', 'Sen', 'Đào', 'Xuân', 'Thanh', 'Tuyết', 'Châu', 'Diệp', 'Giang',
];
const WIFE_SURNAMES = [
    'Nguyễn', 'Trần', 'Phạm', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hoàng', 'Phan', 'Ngô',
    'Dương', 'Đinh', 'Lý', 'Trịnh', 'Vương', 'Tạ', 'Chu', 'Hồ', 'Lương', 'Tô',
];
const RESIDENCES = [
    'Hà Nội', 'Hải Dương', 'Hải Phòng', 'TP. Hồ Chí Minh', 'Đà Nẵng',
    'Bắc Ninh', 'Từ Đường Mộ Trạch', 'Hưng Yên', 'Quảng Ninh',
];
const OVERSEAS = ['Nhật Bản', 'Hoa Kỳ', 'Đức', 'Úc'];
const ACADEMIC = ['Cử nhân', 'Kỹ sư', 'Thạc sĩ', 'Bác sĩ', 'Tiến sĩ', 'Dược sĩ', 'Luật sư', 'Giáo viên'];
const DUTIES = ['Ban Khánh Tiết', 'Ban Khuyến Học', 'Ban Thư Ký Phả Ký', 'Ban Liên Lạc Chi Tộc'];

function mulberry32(seed: number) {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const pad = (n: number) => String(n).padStart(2, '0');

export function buildLeFamily(): LeFamily {
    const rng = mulberry32(20260);
    const int = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
    const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

    const people: LePerson[] = [];
    const byKey = new Map<string, LePerson>();
    const usedNames = new Set<string>(RESERVED_NAMES);
    let counter = 0;

    const uniqueName = (make: () => string): string => {
        for (let i = 0; i < 80; i++) {
            const name = make();
            if (!usedNames.has(name)) {
                usedNames.add(name);
                return name;
            }
        }
        const fallback = `${make()} ${++counter}`;
        usedNames.add(fallback);
        return fallback;
    };

    const addPerson = (base: {
        fullName: string;
        gender: 'Male' | 'Female';
        generation: number;
        branchIndex: number;
        fatherKey: string | null;
        motherKey: string | null;
        birthOrder: number;
        isChief: boolean;
        birthYear: number;
    }): LePerson => {
        const key = `le-${String(++counter).padStart(3, '0')}`;
        const { birthYear, generation, gender } = base;

        let lifespan = int(62, 92);
        if (generation === 1) lifespan = int(70, 88);
        const deathYear = birthYear + lifespan;
        const isAlive = birthYear > 1950 ? true : deathYear > CURRENT_YEAR;

        const bm = int(1, 12);
        const bd = int(1, 28);
        const dm = int(1, 12);
        const dd = int(1, 28);
        const finalDeath = isAlive ? null : Math.min(deathYear, CURRENT_YEAR - 1);

        const age = CURRENT_YEAR - birthYear;
        const person: LePerson = {
            key,
            fullName: base.fullName,
            gender,
            generation,
            branchIndex: base.branchIndex,
            fatherKey: base.fatherKey,
            motherKey: base.motherKey,
            spouseKey: null,
            birthOrder: base.birthOrder,
            isChief: base.isChief,
            isAlive,
            birthYear,
            deathYear: finalDeath,
            birthdaySolar: `${birthYear}-${pad(bm)}-${pad(bd)}`,
            birthdayLunar: `${pad(int(1, 28))}/${pad(int(1, 12))}`,
            deathDateSolar: finalDeath ? `${finalDeath}-${pad(dm)}-${pad(dd)}` : null,
            deathDayLunar: finalDeath ? `${pad(int(1, 28))}/${pad(int(1, 12))}` : null,
            roleTitle: '',
            courtesyName: null,
            duties: null,
            burialPlace: null,
            residence: null,
            ancestralOrigin: ORIGIN,
            phone: null,
            email: null,
            academicLevel: null,
            bio: '',
        };

        if (!isAlive) {
            person.burialPlace =
                generation === 1
                    ? 'Đồi Thọ Vực, Lăng Mộ Tiên Tổ, Nghĩa Trang Bản Tộc'
                    : 'Khu Lăng Mộ Cố, Nghĩa Trang Bản Tộc Chi ' + base.branchIndex;
        } else {
            person.residence = rng() < 0.08 && generation >= 8 ? pick(OVERSEAS) : pick(RESIDENCES);
            if (age >= 18) person.phone = `09${int(10, 99)}.${int(100, 999)}.${int(100, 999)}`;
            if (age >= 22 && rng() < 0.7) person.academicLevel = pick(ACADEMIC);
            if (age >= 30 && rng() < 0.25) person.duties = pick(DUTIES);
        }

        people.push(person);
        byKey.set(key, person);
        return person;
    };

    const makeWife = (
        husband: LePerson,
        fixedName?: string,
    ): LePerson => {
        const birthYear = husband.birthYear + int(-3, 4);
        const middles = husband.generation >= 8 ? FEMALE_MIDDLES_NEW : FEMALE_MIDDLES_OLD;
        const fullName =
            fixedName ??
            uniqueName(() => `${pick(WIFE_SURNAMES)} ${pick(middles)} ${pick(FEMALE_GIVEN)}`);
        const wife = addPerson({
            fullName,
            gender: 'Female',
            generation: husband.generation,
            branchIndex: husband.branchIndex,
            fatherKey: null,
            motherKey: null,
            birthOrder: 1,
            isChief: false,
            birthYear,
        });
        wife.spouseKey = husband.key;
        husband.spouseKey = wife.key;
        return wife;
    };

    // ===== Đời 1: Khởi tổ =====
    const founder = addPerson({
        fullName: 'Lê Văn Quang',
        gender: 'Male',
        generation: 1,
        branchIndex: 1,
        fatherKey: null,
        motherKey: null,
        birthOrder: 1,
        isChief: true,
        birthYear: 1750,
    });
    const founderWife = makeWife(founder, 'Trần Thị Lụa');

    interface Couple {
        husband: LePerson;
        wife: LePerson;
    }
    let couples: Couple[] = [{ husband: founder, wife: founderWife }];

    const FOUNDER_SONS = ['Phúc', 'Thọ', 'Đạt'];
    const FOUNDER_DAUGHTERS = ['Bình', 'Lan'];

    // ===== Đời 2 → 10 =====
    for (let g = 1; g <= 9; g++) {
        const nextCouples: Couple[] = [];

        for (const couple of couples) {
            const { husband, wife } = couple;
            let sons: number;
            let daughters: number;
            if (g === 1) {
                sons = 3;
                daughters = 2;
            } else {
                sons = husband.isChief ? pick([1, 1, 2, 2]) : pick([0, 1, 1, 2, 2]);
                daughters = pick([0, 1, 1, 2]);
            }

            const genders: ('M' | 'F')[] = [
                ...Array<'M'>(sons).fill('M'),
                ...Array<'F'>(daughters).fill('F'),
            ];
            if (g === 1) {
                // Giữ thứ tự: Trưởng nam, thứ nữ, thứ nam, út nữ, út nam
                genders.splice(0, genders.length, 'M', 'F', 'M', 'F', 'M');
            } else {
                for (let i = genders.length - 1; i > 0; i--) {
                    const j = Math.floor(rng() * (i + 1));
                    [genders[i], genders[j]] = [genders[j], genders[i]];
                }
            }

            let birthYear = husband.birthYear + (husband.isChief ? int(22, 26) : int(24, 32));
            let sonIndex = 0;
            let daughterIndex = 0;
            let chiefAssigned = false;

            genders.forEach((gd, idx) => {
                if (idx > 0) birthYear += int(2, 4);
                if (birthYear > LAST_BIRTH_YEAR) return;

                if (gd === 'M') {
                    const isEldestSon = sonIndex === 0;
                    const isChief = husband.isChief && isEldestSon && !chiefAssigned;
                    if (isChief) chiefAssigned = true;
                    const branchIndex = g === 1 ? sonIndex + 1 : husband.branchIndex;
                    const fullName =
                        g === 1
                            ? `Lê Văn ${FOUNDER_SONS[sonIndex]}`
                            : uniqueName(() => `Lê ${pick(MALE_MIDDLES)} ${pick(MALE_GIVEN)}`);
                    const son = addPerson({
                        fullName,
                        gender: 'Male',
                        generation: g + 1,
                        branchIndex,
                        fatherKey: husband.key,
                        motherKey: wife.key,
                        birthOrder: idx + 1,
                        isChief,
                        birthYear,
                    });
                    sonIndex++;

                    if (son.birthYear <= 2003) {
                        const sonWife = makeWife(
                            son,
                            g === 1 && sonIndex === 1 ? 'Phạm Thị Mai' : undefined,
                        );
                        nextCouples.push({ husband: son, wife: sonWife });
                    }
                } else {
                    const middles = g + 1 >= 8 ? FEMALE_MIDDLES_NEW : FEMALE_MIDDLES_OLD;
                    const fullName =
                        g === 1
                            ? `Lê Thị ${FOUNDER_DAUGHTERS[daughterIndex]}`
                            : uniqueName(() => `Lê ${pick(middles)} ${pick(FEMALE_GIVEN)}`);
                    addPerson({
                        fullName,
                        gender: 'Female',
                        generation: g + 1,
                        branchIndex: husband.branchIndex,
                        fatherKey: husband.key,
                        motherKey: wife.key,
                        birthOrder: idx + 1,
                        isChief: false,
                        birthYear,
                    });
                    daughterIndex++;
                }
            });
        }
        couples = nextCouples;
    }

    // ===== Danh vị, tiểu sử =====
    const chiefLine = people.filter((p) => p.isChief);
    const aliveChief = chiefLine.filter((p) => p.isAlive);
    const tocTruong = aliveChief.reduce((a, b) => (b.generation < a.generation ? b : a));
    const chauDichTon = aliveChief.reduce((a, b) => (b.generation > a.generation ? b : a));
    const truongChi = chiefLine.find((p) => p.generation === 2)!;

    const aliveBranch2 = people.filter(
        (p) => p.isAlive && p.gender === 'Male' && p.branchIndex === 2 && p.generation >= 6,
    );
    const phoPool = aliveBranch2.length
        ? aliveBranch2
        : people.filter((p) => p.isAlive && p.gender === 'Male' && !p.isChief);
    const phoBanTriSu = phoPool.reduce((a, b) => (b.generation < a.generation ? b : a));

    for (const p of people) {
        const gen = p.generation;
        const roman = gen;
        if (p.gender === 'Female' && p.fatherKey === null) {
            p.roleTitle = p.isAlive ? 'Dâu Hiền Bản Tộc' : 'Cụ Bà Tiền Nhân';
        } else if (p.gender === 'Female') {
            p.roleTitle = p.isAlive ? 'Con Gái Trong Họ' : 'Tiền Nhân Nữ';
        } else if (p.isChief) {
            p.roleTitle = p.isAlive ? 'Trưởng Nam Đích Tôn' : `Trưởng Chi Đời ${roman}`;
        } else {
            p.roleTitle = p.isAlive ? `Thành Viên Chi ${p.branchIndex}` : 'Tiền Nhân';
        }
        if (!p.isAlive && p.gender === 'Male') {
            p.courtesyName = `Tự ${p.fullName.split(' ').slice(-1)[0]} Đức`;
        }

        const age = p.isAlive ? CURRENT_YEAR - p.birthYear : (p.deathYear ?? 0) - p.birthYear;
        p.bio = p.isAlive
            ? `Đời thứ ${gen} Lê Tộc Đại Tôn, sinh năm ${p.birthYear}, hiện ${age} tuổi. Chi ${p.branchIndex}, quê gốc Mộ Trạch, Hải Dương.`
            : `Đời thứ ${gen} Lê Tộc Đại Tôn, sinh năm ${p.birthYear}, thọ ${age} tuổi. Gìn giữ nếp nhà, phụng sự dòng họ; con cháu đời đời hương khói.`;
    }

    founder.roleTitle = 'Cụ Khởi Tổ';
    founder.duties = 'Thủy tổ khai sơn phá thạch dòng họ';
    founder.bio =
        'Cụ khởi lập nên dòng họ tại vùng đất Mộ Trạch, khai hoang lập ấp, để lại gia quy tổ huấn và phúc đức cho con cháu muôn đời.';
    founderWife.roleTitle = 'Cụ Bà Khởi Tổ';
    founderWife.duties = 'Chính thất phụng dưỡng tổ tông';
    founderWife.bio = 'Cụ bà hiền thục nết na, tần tảo cùng chồng tạo dựng cơ đồ, chăm lo hương hỏa.';

    truongChi.roleTitle = 'Trưởng Chi Đời 2';
    truongChi.duties = 'Trưởng Chi đời thứ hai • Gìn giữ gia phả ký';
    truongChi.courtesyName = 'Tự Phúc Thành';

    tocTruong.roleTitle = 'Tộc Trưởng';
    tocTruong.duties = 'Trưởng Ban Trị Sự Từ Đường Tộc';
    tocTruong.phone = '0912.345.678';
    tocTruong.email = 'khang.le@coinguon.vn';
    tocTruong.fullName = 'Lê Văn Khang';
    tocTruong.courtesyName = 'Tự Khang An';
    tocTruong.bio = `Đương kim Tộc Trưởng Lê Tộc Đại Tôn, đời thứ ${tocTruong.generation}. Chỉ đạo đại tu nhà thờ tổ, thành lập Quỹ Khuyến Học và chủ trì số hóa gia phả.`;

    phoBanTriSu.roleTitle = 'Phó Ban Trị Sự';
    phoBanTriSu.duties = 'Phụ trách Trùng tu Lăng Mộ Gia Tộc';
    phoBanTriSu.phone = '0988.765.432';
    phoBanTriSu.fullName = 'Lê Văn Thịnh';

    if (chauDichTon.key !== tocTruong.key) {
        chauDichTon.roleTitle = 'Cháu Đích Tôn';
        chauDichTon.duties = 'Phụ trách nền tảng Số hóa Gia phả';
        chauDichTon.phone = '0977.888.999';
        chauDichTon.email = 'minh.le@coinguon.vn';
        chauDichTon.fullName = 'Lê Văn Minh';
        chauDichTon.courtesyName = 'Tự Minh Trí';
    }

    return {
        people,
        anchors: {
            founder: founder.key,
            founderWife: founderWife.key,
            truongChi: truongChi.key,
            tocTruong: tocTruong.key,
            phoBanTriSu: phoBanTriSu.key,
            chauDichTon: chauDichTon.key,
        },
    };
}
