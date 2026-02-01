import { OUTLIER_URL } from '../types';

/**
 * Fetches cookies for Outlier using multiple query strategies
 * to cover both v1 (.outlier.ai domain) and v2 (app.outlier.ai) cookie formats.
 *
 * Merge order: parent domain → subdomain → URL-based (last wins).
 */
export const getOutlierCookies = async (): Promise<Record<string, string>> => {
  try {
    console.log('Fetching cookies for Outlier');

    const [urlCookies, parentDomainCookies, subDomainCookies] = await Promise.all([
      chrome.cookies.getAll({ url: OUTLIER_URL }),
      chrome.cookies.getAll({ domain: 'outlier.ai' }),
      chrome.cookies.getAll({ domain: 'app.outlier.ai' }),
    ]);

    console.log(
      `Cookie query results — url: ${urlCookies.length}, domain(outlier.ai): ${parentDomainCookies.length}, domain(app.outlier.ai): ${subDomainCookies.length}`,
    );

    // Merge all sets; later entries overwrite earlier (URL cookies take final precedence)
    const cookieObj: Record<string, string> = {};
    for (const cookie of [...parentDomainCookies, ...subDomainCookies, ...urlCookies]) {
      cookieObj[cookie.name] = cookie.value;
    }

    console.log(`Retrieved ${Object.keys(cookieObj).length} unique cookies for Outlier`);

    // CSRF token is required for both v1 and v2
    if (!cookieObj._csrf) {
      throw new Error('CSRF cookie not found. Please log in to Outlier first.');
    }

    // _jwt is optional — present in v1 but absent in v2
    // (v2 uses httpOnly session cookies instead)

    return cookieObj;
  } catch (error) {
    console.error('Error retrieving cookies:', error);
    throw error;
  }
};
