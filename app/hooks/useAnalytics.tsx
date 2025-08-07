// hooks/useAnalytics.tsx
function useAnalytics() {
  function trackEvent(eventName: string, tags: Record<string, any> = {}) {
    // no-op in UI-only mode, but keep a console log so you can see events during development
    if (process.env.NODE_ENV === "development") {
      console.log("[analytics mock] event:", eventName, tags);
    }
  }
  return { trackEvent };
}

export default useAnalytics;
