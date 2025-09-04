// Cart domain
export { useCartStore } from './cart/cartStore';

// Checkout domain
export { useCheckoutStore } from './checkout/checkoutStore';

// UI stores
export { useCartModalStore } from './ui/cartModalStore';
export { useDrawerStore } from './ui/drawerStore';

// Theme (handled by next-themes now)
// export { useThemeStore } from './theme/themeStore';

// Voiceover
export {
  useVoiceoverStore,
  scrollToVoiceovers,
  scrollToPriceCalculator,
  scrollToSection,
} from './voiceover/voiceoverStore';

// Voiceover cache
export { useVoiceoverStore as useVoiceoverCacheStore } from './voiceoverStore';

import { useCartStore } from './cart/cartStore';
import { useCheckoutStore } from './checkout/checkoutStore';
import { useCartModalStore } from './ui/cartModalStore';
import { useDrawerStore } from './ui/drawerStore';
import { useVoiceoverStore } from './voiceover/voiceoverStore';

// Utility function to reset all stores
export const resetAllStores = () => {
  useCartStore.getState().clearCart();
  useCheckoutStore.getState().resetForm();
  useCheckoutStore.getState().resetProductionConfig();
  useDrawerStore.getState().closeDrawer();
  useCartModalStore.getState().setIsOpen(false);
  useVoiceoverStore.getState().clearSelection();
};
