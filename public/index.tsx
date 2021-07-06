import { ContentTypeDetailTab } from './lib/components';
import { registerCTDetailTab } from './lib/connectors/contentTypes';
import { CONFIG } from './lib/preview.const';

registerCTDetailTab(CONFIG.name, {
	label: 'Voorvertoning',
	module: CONFIG.module,
	component: ContentTypeDetailTab,
	containerId: 'update' as any,
});
