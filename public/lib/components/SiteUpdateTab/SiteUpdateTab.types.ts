export interface SiteUpdateTabFormState {
	allowPreview: 'true' | 'false';
	baseUrl: {
		multilanguage: boolean;
		[lang: string]: string | boolean;
	};
}
