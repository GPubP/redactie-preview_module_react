import { LanguageSchema } from '@redactie/language-module';
import { MultilanguageYup } from '@redactie/utils';

export const FORM_VALIDATION_SCHEMA = (languages: LanguageSchema[]): typeof MultilanguageYup =>
	MultilanguageYup.object().shape({
		allowPreview: MultilanguageYup.boolean(),
		baseUrl: MultilanguageYup.object().when('allowPreview', {
			is: true,
			then: MultilanguageYup.object().validateMultiLanguage(
				languages,
				MultilanguageYup.string()
					.required('Url is een verplicht veld')
					.url('Url moet geldig zijn')
			),
		}),
	});

export const PREVIEW_OPTIONS = [
	{ key: 'not-allowed', label: 'Niet toegestaan', value: false },
	{ key: 'allowed', label: 'Toegestaan', value: true },
];
