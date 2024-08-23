export interface UrlModel {
    success?: boolean;
    msg?: string;
    _id: string;
	originalURL: string;
	shortURL: string;
	name: string;
	id: string;
	sbUserID: string;
	createdAt: Date;
}

export interface UserModel {
    username: string;
    email: string;
    sbUserID: string;
    urls: UrlModel[];
    __v?: number;
}

export interface createArgs {
    originalURL: string;
    name: string;
    sbUserID: string;
}