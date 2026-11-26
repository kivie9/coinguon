export interface ClanAncestralHall {
    name: string;
    shortName: string;
    address: string;
    province: string;
    foundedYear: number;
    foundedYearText: string;
    area: string;
    ranking: string;
    structure: string;
    mapsQueryUrl: string;
    imageUrl?: string;
}

export interface ClanDonation {
    bankName: string;
    accountNumber: string;
    accountNumberClean: string;
    accountHolder: string;
    syntax: string;
    description: string;
    qrUrl?: string;
}

export interface ClanLeader {
    fullName: string;
    role: string;
    generation?: string;
    term: string;
    phone: string;
    email: string;
    avatarUrl: string;
    branch: string;
    bio?: string;
}

export interface ClanContact {
    leader: ClanLeader;
    hotline: string;
    email: string;
    hnContact: string;
    sgContact: string;
}

export interface ClanDocument {
    id: string;
    title: string;
    description: string;
    updatedAt: string;
    fileUrl?: string;
    tag?: string;
}

export interface ClanStats {
    foundedYear: number;
    generationsCount: number;
    totalRegistrations: number;
    scholarsCount: number;
    yearsText: string;
}

export interface ClanCommittee {
    id: string;
    name: string;
    role: string;
    icon: 'users' | 'award' | 'scroll';
}

export interface ClanLiaisonBranch {
    id: string;
    region: string;
    familiesCount: string;
    contactInfo: string;
}

export interface ClanDto {
    id: string;
    name: string;
    shortName: string;
    hanNomName: string;
    branchName: string;
    branchTitle: string;
    branchFullTitle: string;
    slogan: string;
    subSlogan: string;
    motto: string;
    description: string;
    memberExplorerTitle: string;
    memberExplorerSubtitle: string;
    stats: ClanStats;
    committees: ClanCommittee[];
    liaisonBranches: ClanLiaisonBranch[];
    ancestralHall: ClanAncestralHall;
    donation: ClanDonation;
    contact: ClanContact;
    documents: ClanDocument[];
    systemName: string;
    copyright: string;
    copyrightFull: string;
    footerCopyright: string;
}
