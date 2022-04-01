import { Button, RadioGroup, TextField } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	LanguageHeader,
} from '@acpaas-ui/react-editorial-components';
import { LanguageSchema } from '@redactie/language-module';
import { ExternalTabProps } from '@redactie/sites-module';
import {
	DataLoader,
	FormikMultilanguageField,
	FormikOnChangeHandler,
	Language,
	LeavePrompt,
	useDetectValueChanges,
} from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { ChangeEvent, FC, ReactElement, useEffect, useState } from 'react';

import languagesConnector from '../../connectors/languages';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';

import { PREVIEW_OPTIONS } from './SiteUpdateTab.const';
import { SiteUpdateTabFormState } from './SiteUpdateTab.types';

const SiteUpdateTab: FC<ExternalTabProps> = ({
	value = {} as Record<string, any>,
	site,
	isLoading,
	onSubmit,
	onCancel,
}) => {
	const [activeLanguage, setActiveLanguage] = useState<Language | LanguageSchema>();
	const [loadingState, languages] = languagesConnector.hooks.useActiveLanguagesForSite(site.uuid);

	const key = activeLanguage?.key;
	const initialValues: SiteUpdateTabFormState = {
		allowPreview: value?.config?.allowPreview || false,
		baseUrl: {
			multilanguage: true,
			[key ? key : 'nl']: value.config && value?.config?.baseUrl[`${key}`] || value?.config?.baseUrl || '',
		},
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
			config: {
				...formValue,
				allowPreview: formValue.allowPreview,
			},
			validationSchema: {},
		});
		resetChangeDetection();
	};

	const renderForm = (): ReactElement | null => {
		if (!languages) {
			return null;
		}

		return (
			<LanguageHeader
				languages={languages}
				activeLanguage={activeLanguage}
				onChangeLanguage={(language: string) => setActiveLanguage({ key: language })}
			>
				<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
					{({ submitForm }) => {
						return (
							<div className="u-margin-top">
								<p>Bepaal of er voor deze site voorvertoningen zijn toegestaan.</p>
								<div className="row u-margin-top">
									<FormikOnChangeHandler
										onChange={values =>
											setFormValue(values as SiteUpdateTabFormState)
										}
									/>
									<div className="col-xs-12 col-sm-6">
										<Field
											as={RadioGroup}
											id="allowPreview"
											name="allowPreview"
											options={PREVIEW_OPTIONS}
											onChange={(event: ChangeEvent<any>) =>
												setFormValue({
													...formValue,
													allowPreview: event.target.value === 'true',
												})
											}
										/>
									</div>
								</div>
								<div className="row u-margin-top">
									<div className="col-xs-12 col-sm-6">
										{languages.length === 0 ? (
											<TextField
												id="baseUrl"
												name="baseUrl"
												label="Url voor voorvertoning"
												value={formValue.baseUrl}
												onChange={(event: ChangeEvent<any>) =>
													setFormValue({
														...formValue,
														baseUrl: event.target.value,
													})
												}
											/>
										) : (
											<FormikMultilanguageField
												id="baseUrl"
												name="baseUrl"
												asComponent={TextField}
												value={
													formValue.baseUrl[`${key}`]
														? formValue.baseUrl[`${key}`]
														: ''
												}
												label="Url voor voorvertoning"
											/>
										)}
									</div>
								</div>

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
												iconLeft={
													isLoading ? 'circle-o-notch fa-spin' : null
												}
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
			</LanguageHeader>
		);
	};

	return <DataLoader loadingState={loadingState} render={renderForm} />;
};
export default SiteUpdateTab;
