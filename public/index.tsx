import { ContentModel, ContentTypeModel } from '@redactie/content-module';
import { SiteDetailModel } from '@redactie/sites-module';

import { ContentTypeDetailTab } from './lib/components';
import ContentPreviewAction from './lib/components/ContentPreviewAction/ContentPreviewAction';
import SiteUpdateTab from './lib/components/SiteUpdateTab/SiteUpdateTab';
import { registerContentAction } from './lib/connectors/content';
import { registerCTDetailTab } from './lib/connectors/contentTypes';
import { registerSiteUpdateTab } from './lib/connectors/sites';
import { CONFIG } from './lib/preview.const';

registerCTDetailTab(CONFIG.name, {
	label: 'Voorvertoning',
	module: CONFIG.module,
	component: ContentTypeDetailTab,
	containerId: 'update' as any,
});

registerSiteUpdateTab(CONFIG.name, {
	label: 'Voorvertoning',
	module: CONFIG.module,
	component: SiteUpdateTab,
	containerId: 'update' as any,
});

registerContentAction(CONFIG.name, {
	module: CONFIG.module,
	component: ContentPreviewAction,
	show: (ct: ContentTypeModel, site: SiteDetailModel, content: ContentModel) => {
		const allowCTPreview = ct.modulesConfig?.find(
			module => module.name === 'preview' && module.config.allowPreview
		);

		const allowSitePreview = site?.data?.modulesConfig?.find(
			module => module.name === 'preview' && module.config.allowPreview
		);

		return (
			!!allowCTPreview &&
			!!allowSitePreview &&
			!!(
				content.meta.historySummary?.draft.uuid ||
				content.meta.historySummary?.pendingPublish.uuid ||
				content.meta.historySummary?.pendingReview.uuid
			)
		);
	},
});
