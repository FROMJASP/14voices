# Admin Tours Documentation

## Overview
The 14voices admin panel includes an interactive tour system built with Driver.js to help non-technical users navigate the admin interface. The tours are context-aware and available in Dutch.

## Key Files

### 1. `/src/components/admin/AdminTours.tsx`
Main tour configuration file containing all tour definitions and logic.

**Tour Types:**
- `firstTime` - General dashboard tour for new users
- `voiceoverTour` - Specific to voiceovers collection
- `pageTour` - Pages collection tour
- `formTour` - Forms collection tour  
- `emailTour` - Email system tour
- `bookingTour` - Bookings collection tour
- `siteBuilderTour` - Site Builder collections tour

**Key Functions:**
- `AdminTours()` - Component that auto-starts tour for first-time users
- `startTour(tourName)` - Function to programmatically start specific tours

### 2. `/src/components/admin/AdminActions.tsx`
Renders the "Rondleiding" button in the top navigation bar. Contains logic to detect current page and start appropriate tour.

### 3. `/src/components/admin/driver-theme.css`
Custom styling for Driver.js tours including:
- Light overlay (15% opacity) for visibility
- White highlighted elements with blue borders
- Modern card-style popovers
- Custom button styling
- Pulsing animation for highlights

### 4. `/src/components/admin/admin-overrides.css`
Contains CSS to hide the locale selector in admin panel.

## How to Update Tours

### Adding a New Tour Step
In `AdminTours.tsx`, find the relevant tour and add to the steps array:
```typescript
{
  element: '.css-selector-for-element',
  popover: {
    title: '🎯 Step Title',
    description: 'Explanation in Dutch (informal je/jouw)',
    position: 'right', // or 'left', 'top', 'bottom'
  },
},
```

### Creating a New Tour
1. Add new tour definition to the `tours` object:
```typescript
newFeatureTour: {
  id: 'new-feature-tour',
  title: 'Nieuwe Feature',
  description: 'Leer over de nieuwe feature',
  steps: [
    // Add steps here
  ],
},
```

2. Update `AdminActions.tsx` to detect when to show this tour:
```typescript
else if (path.includes('/collections/new-feature')) {
  startTour('newFeatureTour')
}
```

### Modifying Tour Behavior
Tour configuration options in `startTour()` and `AdminTours()`:
- `showProgress: true` - Shows progress dots
- `showButtons: ['next', 'previous', 'close']` - Button visibility
- `animate: true` - Enable animations
- `smoothScroll: true` - Smooth scrolling to elements
- `disableActiveInteraction: true` - Prevent clicking highlighted elements
- `stagePadding: 8` - Padding around highlighted elements
- `popoverOffset: 12` - Distance between highlight and popover

## Language Guidelines
- Always use informal Dutch (je/jouw instead of u/uw)
- Use emoji icons in titles for visual appeal
- Keep descriptions concise but informative
- Focus on what users can DO, not technical details

## Testing Tours
1. Clear localStorage to reset first-time tour:
```javascript
localStorage.removeItem('14voices_tour_completed')
```

2. Click "Rondleiding" button to manually start tours

3. Test on different pages to ensure context-aware tours work

## Common Issues & Solutions

**Tour not highlighting correctly:**
- Check if element selector is correct
- Ensure element is visible when tour starts
- May need to add delay if element loads dynamically

**Styling issues:**
- All tour styles are in `driver-theme.css`
- Use `!important` sparingly but may be needed to override Driver.js defaults
- Test in both light and dark modes

**Tour not starting:**
- Check browser console for errors
- Verify tour name matches in both definition and startTour call
- Ensure Driver.js is properly imported

## Future Enhancements
- Add user preference to auto-start tours for new features
- Create onboarding checklist that tracks completed tours
- Add tour analytics to see which steps users skip
- Consider adding video alternatives for complex workflows