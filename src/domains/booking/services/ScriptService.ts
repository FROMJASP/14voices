import { ScriptRepository } from '../repositories/ScriptRepository';
import { Script, ScriptAccess } from '../types';

export class ScriptService {
  constructor(private scriptRepository: ScriptRepository) {}

  async getScript(scriptId: string, userId: string, userRole: string): Promise<Script | null> {
    const script = await this.scriptRepository.getScript(scriptId);

    if (!script) {
      return null;
    }

    // Check access permissions
    const access = this.checkScriptAccess(script, userId, userRole);

    if (!access.hasAccess) {
      throw new Error('Access denied');
    }

    // Log access
    await this.scriptRepository.logAccess(scriptId, userId, 'viewed');

    return script;
  }

  checkScriptAccess(script: Script, userId: string, userRole: string): ScriptAccess {
    // Admin has access to all scripts
    if (userRole === 'admin') {
      return { hasAccess: true, reason: 'admin' };
    }

    // Owner has access
    if (script.uploadedBy === userId) {
      return { hasAccess: true, reason: 'owner' };
    }

    // Assigned voiceover has access
    const assignedVoiceoverId =
      typeof script.assignedVoiceover === 'object'
        ? script.assignedVoiceover.id
        : script.assignedVoiceover;

    if (assignedVoiceoverId === userId) {
      return { hasAccess: true, reason: 'assigned' };
    }

    return { hasAccess: false, reason: 'denied' };
  }

  async deleteScript(scriptId: string, userId: string, userRole: string): Promise<void> {
    const script = await this.scriptRepository.getScript(scriptId);

    if (!script) {
      throw new Error('Script not found');
    }

    // Only admin or owner can delete
    if (userRole !== 'admin' && script.uploadedBy !== userId) {
      throw new Error('Access denied');
    }

    await this.scriptRepository.deleteScript(scriptId);
  }

  async getUserScripts(userId: string, userRole: string): Promise<Script[]> {
    return this.scriptRepository.getUserScripts(userId, userRole);
  }

  async getUpcomingDeadlines(days: number = 7): Promise<Script[]> {
    return this.scriptRepository.getScriptsByDeadline(days);
  }

  formatScriptResponse(script: Script): Partial<Script> {
    return {
      id: script.id,
      title: script.title,
      filename: script.filename,
      filesize: script.filesize,
      url: script.url,
      originalFilename: script.originalFilename,
      instructions: script.instructions,
      scriptType: script.scriptType,
      language: script.language,
      deadline: script.deadline,
      assignedVoiceover: script.assignedVoiceover,
      uploadedBy: script.uploadedBy,
    };
  }
}
