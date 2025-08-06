import { Payload, Where } from 'payload';
import { Script, AccessLogEntry } from '../types';

export class ScriptRepository {
  constructor(private payload: Payload) {}

  async getScript(id: string): Promise<Script | null> {
    try {
      const script = await this.payload.findByID({
        collection: 'scripts',
        id,
        depth: 1,
      });
      return script as unknown as Script;
    } catch {
      return null;
    }
  }

  async updateScript(id: string, data: Partial<Script>): Promise<Script> {
    // Convert uploadedBy to number for Payload
    const updateData: any = { ...data };
    if (data.uploadedBy) {
      updateData.uploadedBy = Number(data.uploadedBy);
    }

    const script = await this.payload.update({
      collection: 'scripts',
      id,
      data: updateData,
    });
    return script as unknown as Script;
  }

  async deleteScript(id: string): Promise<void> {
    await this.payload.delete({
      collection: 'scripts',
      id,
    });
  }

  async logAccess(
    scriptId: string,
    userId: string,
    action: AccessLogEntry['action']
  ): Promise<void> {
    const script = await this.getScript(scriptId);
    if (!script) return;

    await this.payload.update({
      collection: 'scripts',
      id: scriptId,
      data: {
        accessLog: [
          ...(script.accessLog || []),
          {
            accessedBy: Number(userId),
            accessedAt: new Date().toISOString(),
            action,
          } as any,
        ],
      },
    });
  }

  async getUserScripts(userId: string, role: string = 'customer'): Promise<Script[]> {
    const where: Where | undefined =
      role === 'admin'
        ? undefined
        : {
            or: [
              { uploadedBy: { equals: Number(userId) } },
              { assignedVoiceover: { equals: Number(userId) } },
            ],
          };

    const response = await this.payload.find({
      collection: 'scripts',
      where,
      depth: 1,
      sort: '-createdAt',
    });

    return response.docs as unknown as Script[];
  }

  async getScriptsByDeadline(days: number = 7): Promise<Script[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const response = await this.payload.find({
      collection: 'scripts',
      where: {
        deadline: {
          less_than: futureDate.toISOString(),
        },
      },
      depth: 1,
      sort: 'deadline',
    });

    return response.docs as unknown as Script[];
  }
}
