export interface SiteUpdateTabFormState {
	allowPreview: boolean;
	baseUrl: {
		multilanguage: boolean;
		[lang: string]: string | boolean;
	};
}
