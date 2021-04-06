export const req = {
    post: (url, data, options: object = {
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
    }) => fetch(url, {method: 'post', body: JSON.stringify(data), ...options})
}