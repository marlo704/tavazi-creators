class MuviClient {
  private base = import.meta.env.VITE_MUVI_API_BASE;
  private key = import.meta.env.VITE_MUVI_API_KEY;

  private async get(path: string) {
    const r = await fetch(this.base + path, {
      headers: { Authorization: 'Bearer ' + this.key },
    });
    if (!r.ok) throw new Error('Muvi API ' + r.status + ': ' + path);
    return r.json();
  }

  getContents() {
    return this.get('/contents?limit=100');
  }

  getSubscriberCount() {
    return this.get('/subscribers?count=true');
  }

  getPPVOrders(from: string, to: string) {
    return this.get('/transactions?from=' + from + '&to=' + to + '&type=ppv');
  }
}

export const muvi = new MuviClient();
