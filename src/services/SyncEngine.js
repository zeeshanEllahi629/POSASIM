import prisma from "@/lib/prisma";
import MarketplaceService from "./MarketplaceService";
import SocialCommerceService from "./SocialCommerceService";

/**
 * SyncEngine
 * Handles dispatching inventory and catalog updates to enabled platforms,
 * and logging the results in the sync_log table.
 */
class SyncEngine {
  constructor(clientId = 1) {
    this.clientId = clientId;
  }

  /**
   * Main entry point when a product's inventory is updated in POS.
   */
  async syncInventoryChange(sku, newQuantity) {
    // 1. Fetch active marketplace settings for the client
    const activeMarketplaces = await prisma.marketplace_settings.findMany({
      where: { client_id: this.clientId, is_active: 1 }
    });

    // 2. Dispatch updates to each active platform
    for (const setting of activeMarketplaces) {
      try {
        if (["shopify", "amazon", "ebay"].includes(setting.platform)) {
          const service = new MarketplaceService(setting);
          const result = await service.pushInventory(sku, newQuantity);
          await this._logSync(setting.platform, "inventory_push", "SUCCESS", sku, result);
        } else if (["facebook", "instagram", "tiktok", "whatsapp"].includes(setting.platform)) {
          // Social platforms usually want full product data, here we stub with an object
          const service = new SocialCommerceService(setting);
          const result = await service.syncProductToCatalog({ sku, qty: newQuantity });
          await this._logSync(setting.platform, "catalog_sync", "SUCCESS", sku, result);
        }
      } catch (error) {
        await this._logSync(setting.platform, "sync_failed", "FAILED", sku, null, error.message);
      }
    }
  }

  async _logSync(platform, action, status, targetId, payload, errorMessage = null) {
    await prisma.sync_log.create({
      data: {
        platform,
        action,
        status,
        target_id: targetId,
        payload: payload ? JSON.stringify(payload) : null,
        error_message: errorMessage
      }
    });
  }
}

export default SyncEngine;
