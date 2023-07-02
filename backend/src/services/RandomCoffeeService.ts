import * as https from 'https';

class RandomCoffeeService {
    public async getCoffee() {
        const responses = await Promise.all([
            this.getCoffeeData(),
            this.getCoffeeImageData(),
        ]);
        const coffee = responses[0]; // TODO: rename blend_name to blendName
        coffee.image = responses[1]?.file || '';
        coffee.notes = coffee.notes?.split(', ');
        return coffee;
    }

    private async getCoffeeData() {
        return await this.fetchData<Record<string, any>>('https://random-data-api.com/api/coffee/random_coffee');
    }

    private async getCoffeeImageData() {
        return await this.fetchData<Record<string, any>>('https://loremflickr.com/json/500/500/coffee,bean');
    }

    private async fetchData<Response = any>(url: string): Promise<Response> {
        return await new Promise((resolve, reject) => {
            let data = '';
            https.get(url, (response) => {
                response.on('data', chunk => data += chunk);
                response.on('error', err => reject(err));
                response.on('end', () => resolve(JSON.parse(data)));
            });
        });
    }
}

export default new RandomCoffeeService();
