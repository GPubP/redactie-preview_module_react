import { ContentAPI, ExternalActionOptions } from '@redactie/content-module';
import Core from '@redactie/redactie-core';

const contentModuleAPI: ContentAPI = Core.modules.getModuleAPI('content-module') as ContentAPI;

export const registerContentAction = (key: string, options: ExternalActionOptions): void | false =>
	contentModuleAPI ? contentModuleAPI.registerContentDetailAction(key, options) : false;
