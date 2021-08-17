import { api } from '../api';
import { SITE_REQUEST_PREFIX_URL } from '../api/api.service.const';

import { PreviewSchema } from './preview.service.types';

export class PreviewApiService {
	public createPreview(
		siteId: string,
		contentId: string,
		revisionId: string | null
	): Promise<PreviewSchema | null> {
		return api
			.post(`${SITE_REQUEST_PREFIX_URL}/${siteId}/content/${contentId}/preview`, {
				...(revisionId && {
					searchParams: {
						revisionId,
					},
				}),
			})
			.json();
	}
}

export const previewApiService = new PreviewApiService();
