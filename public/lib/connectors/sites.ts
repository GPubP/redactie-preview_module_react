import Core from '@redactie/redactie-core';
import { ExternalTabOptions, SitesModuleAPI } from '@redactie/sites-module';

const sitesModuleAPI: SitesModuleAPI = Core.modules.getModuleAPI('sites-module') as SitesModuleAPI;

export const registerSiteUpdateTab = (key: string, options: ExternalTabOptions): void | false =>
	sitesModuleAPI ? sitesModuleAPI.registerSiteUpdateTab(key, options) : false;
