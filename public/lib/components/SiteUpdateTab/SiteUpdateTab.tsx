import { Button, RadioGroup, TextField } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import { ExternalTabProps } from '@redactie/sites-module';
import { LeavePrompt, useDetectValueChanges } from '@redactie/utils';
import { Field, Formik } from 'formik';
import React, { ChangeEvent, FC, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors/translations';

import { PREVIEW_OPTIONS } from './SiteUpdateTab.const';
import { SiteUpdateTabFormState } from './SiteUpdateTab.types';

const SiteUpdateTab: FC<ExternalTabProps> = ({
	value = {} as Record<string, any>,
	isLoading,
	onSubmit,
	onCancel,
}) => {
	const initialValues: SiteUpdateTabFormState = {
		allowPreview: value?.config?.allowPreview || false,
		baseUrl: value?.config?.baseUrl || '',
	};
	const [t] = useCoreTranslation();
	const [formValue, setFormValue] = useState<any | null>(initialValues);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(!isLoading, formValue);

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

	return (
		<Formik onSubmit={onFormSubmit} initialValues={initialValues}>
			{({ submitForm }) => {
				return (
					<>
						<p>Bepaal of er voor deze site voorvertoningen zijn toegestaan.</p>
						<div className="row u-margin-top">
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
					</>
				);
			}}
		</Formik>
	);
};

export default SiteUpdateTab;
