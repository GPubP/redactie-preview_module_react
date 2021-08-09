import { Button } from '@acpaas-ui/react-components';
import { ExternalActionProps } from '@redactie/content-module';
import { pathOr, propOr } from 'ramda';
import React, { FC, useEffect, useState } from 'react';

import { previewApiService } from '../../../services/preview';

import { CONTENT_STATUS_API_MAP } from './ContentPreviewAction.const';

const ContentPreviewAction: FC<ExternalActionProps> = ({ site, contentItem }) => {
	const [revisionId, setRevisionId] = useState<string>('');

	useEffect(() => {
		const revisionId = pathOr(
			'',
			[
				'meta',
				'historySummary',
				propOr('draft', contentItem.meta.status, CONTENT_STATUS_API_MAP),
				'uuid',
			],
			contentItem
		);
		setRevisionId(revisionId);
	}, [contentItem, site]);

	const createPreview = async (): Promise<void> => {
		const preview = await previewApiService.createPreview(
			site.uuid,
			contentItem.uuid as string,
			revisionId
		);

		const previewConfig = site?.data?.modulesConfig?.find(module => module.name === 'preview');

		const win = window.open(
			`${previewConfig?.config.baseUrl}?wcm-preview-id=${preview?.uuid}`,
			'_blank'
		);

		if (win != null) {
			win.focus();
		}
	};

	return (
		<Button
			onClick={createPreview}
			icon="eye"
			ariaLabel="Show preview"
			type="primary"
			htmlType="button"
			negative
		/>
	);
};

export default ContentPreviewAction;
