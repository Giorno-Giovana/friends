export async function useApi<TResponse>(url: string) {
    try {
        const baseIP: string = 'http://192.168.1.166:3001/';
        return $fetch(baseIP + url, {
            method: 'GET',
            // ...options
        });
    } catch (e) {
        console.log(e);
    }
    
}