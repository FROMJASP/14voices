// Cart domain
export { useCartStore } from './cart/cartStore';

// Checkout domain
export { useCheckoutStore } from './checkout/checkoutStore';

// UI stores
export { useCartModalStore } from './ui/cartModalStore';
export { useDrawerStore } from './ui/drawerStore';

// Theme (handled by next-themes now)
// export { useThemeStore } from './theme/themeStore';

// Voiceover selection
export {
  useVoiceoverSelectionStore,
  scrollToVoiceovers,
  scrollToPriceCalculator,
  scrollToSection,
} from './voiceover/voiceoverSelectionStore';

// Voiceover cache
export { useVoiceoverCacheStore } from './voiceoverCacheStore';

import { useCartStore } from './cart/cartStore';
import { useCheckoutStore } from './checkout/checkoutStore';
import { useCartModalStore } from './ui/cartModalStore';
import { useDrawerStore } from './ui/drawerStore';
import { useVoiceoverSelectionStore } from './voiceover/voiceoverSelectionStore';

// Utility function to reset all stores
export const resetAllStores = () => {
  useCartStore.getState().clearCart();
  useCheckoutStore.getState().resetForm();
  useCheckoutStore.getState().resetProductionConfig();
  useDrawerStore.getState().closeDrawer();
  useCartModalStore.getState().setIsOpen(false);
  useVoiceoverSelectionStore.getState().clearSelection();
};
