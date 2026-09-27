import type { MusicImporter } from './MusicImporter';
import type { ImportProviderId } from './types';

class ImporterRegistryClass {
  private importers: Map<ImportProviderId, MusicImporter> = new Map();

  register(importer: MusicImporter) {
    this.importers.set(importer.providerId, importer);
  }

  get(providerId: ImportProviderId): MusicImporter | undefined {
    return this.importers.get(providerId);
  }

  getAll(): MusicImporter[] {
    return Array.from(this.importers.values());
  }
}

export const ImporterRegistry = new ImporterRegistryClass();
