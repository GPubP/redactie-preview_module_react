import { LanguageSchema } from '@redactie/language-module';
import { MultilanguageYup } from '@redactie/utils';

export const FORM_VALIDATION_SCHEMA = (languages: LanguageSchema[]): typeof MultilanguageYup =>
	MultilanguageYup.object().shape({
		baseUrl: MultilanguageYup.object().validateMultiLanguage(
			languages,
			MultilanguageYup.string()
				.required('Url is een verplicht veld')
				.url('Url moet valid zijn')
		),
	});

export const PREVIEW_OPTIONS = [
	{ key: 'not-allowed', label: 'Niet toegestaan', value: false },
	{ key: 'allowed', label: 'Toegestaan', value: true },
];
