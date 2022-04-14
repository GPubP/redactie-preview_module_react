import { Button, RadioGroup, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	LanguageHeaderContext,
} from '@acpaas-ui/react-editorial-components';
import { LanguageSchema } from '@redactie/language-module';
import { ExternalTabProps } from '@redactie/sites-module';
import {
	FormikMultilanguageField,
	FormikOnChangeHandler,
	handleMultilanguageFormErrors,
	Language,
	LeavePrompt,
	useDetectValueChanges,
} from '@redactie/utils';
import { Field, Formik, FormikErrors, FormikValues } from 'formik';
import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';

import languagesConnector from '../../connectors/languages';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';

import { FORM_VALIDATION_SCHEMA, PREVIEW_OPTIONS } from './SiteUpdateTab.const';
import { SiteUpdateTabFormState } from './SiteUpdateTab.types';

const SiteUpdateTabForm: FC<Omit<ExternalTabProps, 'updateSite'> & {
	onChangeFormValue: (values: SiteUpdateTabFormState) => void;
}> = ({
	value = {} as Record<string, any>,
	site,
	isLoading,
	onSubmit,
	onCancel,
	onChangeFormValue,
}) => {
	const [activeLanguage, setActiveLanguage] = useState<Language | LanguageSchema>();
	const [, languages] = languagesConnector.hooks.useActiveLanguagesForSite(site.uuid);
	const { setErrors } = useContext(LanguageHeaderContext);

	const initialValues: SiteUpdateTabFormState = {
		allowPreview: value?.config?.allowPreview || false,
		baseUrl: value?.config?.baseUrl ? value?.config?.baseUrl : '',
	};
	const [t] = useCoreTranslation();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);

	useEffect(() => {
		if (Array.isArray(languages) && !activeLanguage) {
			setActiveLanguage(languages.find(l => l.primary) || languages[0]);
		}
	}, [activeLanguage, languages]);

	const onFormSubmit = (): void => {
		onSubmit({
			config: formValue,
			validationSchema: {},
		});
		resetChangeDetection();
	};

	const handleOnError = (values: any, formErrors: FormikErrors<FormikValues>): void => {
		setFormValue(values as SiteUpdateTabFormState);

		const newErrors = handleMultilanguageFormErrors(formErrors, values);
		setErrors(newErrors);
	};

	const onChangeValues = (values: FormikValues): void => {
		setFormValue(values as SiteUpdateTabFormState);
		onChangeFormValue(values as SiteUpdateTabFormState);
	};

	if (!languages) {
		return <></>;
	}

	return (
		<Formik
			onSubmit={onFormSubmit}
			initialValues={initialValues}
			validationSchema={() => FORM_VALIDATION_SCHEMA(languages)}
		>
			{({ submitForm, setFieldValue }) => {
				return (
					<div className="u-margin-top">
						<p>Bepaal of er voor deze site voorvertoningen zijn toegestaan.</p>
						<div className="row u-margin-top">
							<FormikOnChangeHandler
								onChange={onChangeValues}
								onError={handleOnError}
							/>
							<div className="col-xs-12 col-sm-6">
								<Field
									as={RadioGroup}
									id="allowPreview"
									name="allowPreview"
									options={PREVIEW_OPTIONS}
									onChange={(event: ChangeEvent<HTMLInputElement>) => {
										setFieldValue(
											'allowPreview',
											event.target.value === 'true'
										);
									}}
								/>
							</div>
						</div>
						{!!formValue.allowPreview &&
							(languages.length === 0 ? (
								<div className="row u-margin-top">
									<div className="col-xs-12 col-sm-6">
										<TextField
											id="baseUrl.nl"
											name="baseUrl.nl"
											label="Url voor voorvertoning"
											value={formValue.baseUrl}
										/>
									</div>
								</div>
							) : (
								<div className="u-margin-top">
									<FormikMultilanguageField
										id="baseUrl"
										name="baseUrl"
										asComponent={TextField}
										className="u-w-50"
										label="Url voor voorvertoning"
									/>
								</div>
							))}

						<ActionBar className="o-action-bar--fixed" isOpen>
							<ActionBarContentSection>
								<div className="u-wrapper row end-xs">
									<Button
										className="u-margin-right-xs"
										onClick={onCancel}
										negative
									>
										{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
									</Button>
									<Button
										iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
										disabled={isLoading || !hasChanges}
										onClick={submitForm}
										type="success"
										htmlType="submit"
									>
										{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
						<LeavePrompt
							shouldBlockNavigationOnConfirm
							when={hasChanges}
							onConfirm={submitForm}
						/>
					</div>
				);
			}}
		</Formik>
	);
};
export default SiteUpdateTabForm;
