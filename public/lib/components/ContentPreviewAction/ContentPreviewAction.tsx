import { Button } from '@acpaas-ui/react-components';
import React, { FC } from 'react';

const ContentPreviewAction: FC = () => {
	const createPreview = (): void => {
		// create preview

		const win = window.open(`https://sporza.be`, '_blank');
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
