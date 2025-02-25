export default class PagesApiHandler {
    static async #makeRequest(endpoint, command, cookie, data = null) {
        if (!endpoint || typeof endpoint != 'string') {
            throw new Error('Invalid endpoint');
        }
        if (!command || typeof command != 'string') {
            throw new Error('Invalid command');
        }
        // if (!cookie || typeof cookie != 'string') {
        //     throw new Error('Invalid cookie');
        // }

        try {
            const requestBody = {
                command,
                cookie,
                ...(data && { data })
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            console.error(`API Request Failed (${command}):`, error);
            throw new Error(`Failed to process ${command}: ${error.message}`);
        }
    }

    static async getTitles(cookie) {
        return await this.#makeRequest('/api/pages', 'pages.send.titles', cookie);
    }

    static async createPage(pageTitle, cookie) {
        if (!pageTitle || typeof pageTitle !== 'string') {
            throw new Error('Invalid page title');
        }
        return await this.#makeRequest('/api/pages', 'pages.create', cookie, { pageTitle });
    }

    static async deletePage(_id, cookie) {
        if (!_id || typeof _id !== 'string') {
            throw new Error('Invalid page ID');
        }
        return await this.#makeRequest('/api/pages', 'pages.delete', cookie, { _id });
    }

    static async editPage(_id, pageBody, pageTitle = null, cookie) {
        if (!_id || typeof _id !== 'string') {
            throw new Error('Invalid page ID');
        }
        if (!pageBody || typeof pageBody !== 'string') {
            throw new Error('Invalid page body');
        }
        if (pageTitle !== null && typeof pageTitle !== 'string') {
            throw new Error('Invalid page title');
        }

        const data = {
            _id,
            pageBody,
            ...(pageTitle && { pageTitle })
        };

        return await this.#makeRequest('/api/pages', 'pages.edit', cookie, data);
    }

    static async getPage(pageTitle, cookie) {
        if (!pageTitle || typeof pageTitle !== 'string') {
            throw new Error('Invalid page title');
        }
        return await this.#makeRequest('/api/pages', 'pages.send.page', cookie, { pageTitle });
    }

    static isValidResponse(response) {
        return response && 
               typeof response === 'object' && 
               !Array.isArray(response) &&
               !response.error;
    }
}
