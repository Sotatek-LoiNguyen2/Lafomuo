export class BaseHandle {
  protected programId: string;
  protected type: string;
  public async processTransaction(programId: string, type: string, data: any): Promise<any> {
    return null;
  }

  public async processLog(programId: string, data: any): Promise<any> {
    return null;
  }
}
