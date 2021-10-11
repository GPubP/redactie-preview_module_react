import { Button } from '@acpaas-ui/react-components';
import { ExternalActionProps } from '@redactie/content-module';
import { pathOr } from 'ramda';
import React, { FC, useEffect, useState } from 'react';

import { previewApiService } from '../../services/preview';

const ContentPreviewAction: FC<ExternalActionProps> = ({ site, contentItem }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [slug, setSlug] = useState<string>('');

	useEffect(() => {
		// TODO: Dynamically select active language
		const slug = pathOr('', ['meta', 'slug', 'nl'], contentItem);
		setSlug(slug);
	}, [contentItem, site]);

	const createPreview = async (): Promise<void> => {
		setLoading(true);
		const preview = await previewApiService.createPreview(
			site.uuid,
			contentItem.uuid as string,
			null
		);

		setLoading(false);
		const previewConfig = site?.data?.modulesConfig?.find(module => module.name === 'preview');

		const win = window.open(
			`${previewConfig?.config.baseUrl}/${slug}?wcm-preview-id=${preview?.uuid}`,
			'_blank'
		);

		if (win != null) {
			win.focus();
		}
	};

	return (
		<Button
			onClick={createPreview}
			icon={loading ? 'circle-o-notch fa-spin' : 'eye'}
			ariaLabel="Show preview"
			type="primary"
			htmlType="button"
			negative
		/>
	);
};

export default ContentPreviewAction;
