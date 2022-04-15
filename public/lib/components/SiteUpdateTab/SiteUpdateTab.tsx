import { LanguageHeader } from '@acpaas-ui/react-editorial-components';
import { LanguageSchema } from '@redactie/language-module';
import { ExternalTabProps } from '@redactie/sites-module';
import { DataLoader, Language } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import languagesConnector from '../../connectors/languages';

import { SiteUpdateTabFormState } from './SiteUpdateTab.types';
import SiteUpdateTabForm from './SiteUpdateTabForm';

const SiteUpdateTab: FC<ExternalTabProps> = ({ value, site, isLoading, onSubmit, onCancel }) => {
	const [activeLanguage, setActiveLanguage] = useState<Language | LanguageSchema>();
	const [loadingState, languages] = languagesConnector.hooks.useActiveLanguagesForSite(site.uuid);
	const [visibility, setVisibility] = useState<boolean>(value?.config?.allowPreview || false);

	useEffect(() => {
		if (Array.isArray(languages) && !activeLanguage) {
			setActiveLanguage(languages.find(l => l.primary) || languages[0]);
		}
	}, [activeLanguage, languages]);

	const onChangeFormValue = (values: SiteUpdateTabFormState): void => {
		setVisibility(values.allowPreview);
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
				isVisible={visibility}
			>
				<SiteUpdateTabForm
					value={value}
					site={site}
					isLoading={isLoading}
					onSubmit={onSubmit}
					onCancel={onCancel}
					onChangeFormValue={onChangeFormValue}
				></SiteUpdateTabForm>
			</LanguageHeader>
		);
	};

	return <DataLoader loadingState={loadingState} render={renderForm} />;
};
export default SiteUpdateTab;
