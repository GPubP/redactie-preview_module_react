import { ContentTypeDetailTab } from './lib/components';
import SiteUpdateTab from './lib/components/SiteUpdateTab/SiteUpdateTab';
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
