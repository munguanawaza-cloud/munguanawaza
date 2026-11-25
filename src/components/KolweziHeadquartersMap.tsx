import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  AdvancedMarker,
  APILoadingStatus,
  APIProvider,
  ColorScheme,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  BookmarkCheck,
  Compass,
  Download,
  ExternalLink,
  Layers,
  Loader2,
  MapPin,
  PlusCircle,
  Search,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import type { Language, TranslationContent } from '../i18n/translations';

interface KolweziHeadquartersMapProps {
  t: TranslationContent['contact']['map'];
  lang: Language;
  isRtl: boolean;
}

interface ResolvedPlace {
  id: string;
  name: string;
  address: string;
  position: google.maps.LatLngLiteral;
  isPartner?: boolean;
}

interface CachedMapSnapshot {
  expiresAt: number;
  places: ResolvedPlace[];
}

const HQ_QUERY = 'Kolwezi, Lualaba, Democratic Republic of the Congo';
const PARTNER_PRIMARY_QUERY = 'Le Manguier, Dilala, Kolwezi, Democratic Republic of the Congo';
const PARTNER_FALLBACK_QUERY = 'Dilala, Kolwezi, Democratic Republic of the Congo';
const OFFLINE_CACHE_KEY = 'maw_muans_go_places_cache_v1';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30-day max geospatial caching per GMP Terms
const EXTERNAL_MAPS_FALLBACK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HQ_QUERY)}`;

function isQuotaOrAuthError(err: unknown): boolean {
  const text = String(
    err && typeof err === 'object' && 'message' in err
      ? (err as { message?: unknown }).message
      : err
  );
  return (
    text.includes('429') ||
    text.includes('RESOURCE_EXHAUSTED') ||
    text.includes('OVER_QUERY_LIMIT') ||
    text.includes('OverQuotaMapError') ||
    text.includes('QuotaExceededError')
  );
}

function buildPlaceUrl(place: ResolvedPlace | null): string {
  if (!place) return EXTERNAL_MAPS_FALLBACK_URL;
  const query = encodeURIComponent(place.address || place.name);
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${encodeURIComponent(place.id)}`;
}

function readCachedSnapshot(): ResolvedPlace[] {
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<CachedMapSnapshot> | null;
    if (!parsed || typeof parsed.expiresAt !== 'number' || !Array.isArray(parsed.places)) {
      return [];
    }
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(OFFLINE_CACHE_KEY);
      return [];
    }
    return parsed.places.filter(
      (p): p is ResolvedPlace =>
        Boolean(p && p.id && p.name && p.position && typeof p.position.lat === 'number' && typeof p.position.lng === 'number')
    );
  } catch {
    return [];
  }
}

function writeCachedSnapshot(places: ResolvedPlace[]): boolean {
  try {
    const payload: CachedMapSnapshot = {
      expiresAt: Date.now() + CACHE_TTL_MS,
      places,
    };
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

function PlaceMarkerWithInfoWindow({
  place,
  isPrimaryHq,
  hqLabel,
  openExternalLabel,
  isSelected,
  onSelect,
  onClose,
}: {
  place: ResolvedPlace;
  isPrimaryHq: boolean;
  hqLabel: string;
  openExternalLabel: string;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const pinColors = isPrimaryHq
    ? { bg: '#D4AF37', border: '#8A6E1C', glyph: '#0A0A0A', scale: 1.2 }
    : place.isPartner
      ? { bg: '#E5C558', border: '#9A7B22', glyph: '#0A0A0A', scale: 1.1 }
      : { bg: '#1F1F1F', border: '#D4AF37', glyph: '#D4AF37', scale: 1.0 };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={place.position}
        title={isPrimaryHq ? hqLabel : place.name}
        onClick={onSelect}
      >
        <Pin
          background={pinColors.bg}
          borderColor={pinColors.border}
          glyphColor={pinColors.glyph}
          scale={pinColors.scale}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={onClose}>
          <div className="p-1 text-left text-neutral-900" dir="ltr">
            <div className="text-xs font-bold text-neutral-950">
              {isPrimaryHq ? hqLabel : place.name}
            </div>
            {place.address && (
              <p className="mt-1 text-xs leading-snug text-neutral-700">
                {place.address}
              </p>
            )}
            <a
              href={buildPlaceUrl(place)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 underline hover:text-amber-950"
            >
              <span>{openExternalLabel}</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function KolweziMapCanvas({
  t,
  lang,
  isRtl,
  isOnline,
  cachedPlaces,
  onSaveSnapshot,
  onClearSnapshot,
}: KolweziHeadquartersMapProps & {
  isOnline: boolean;
  cachedPlaces: ResolvedPlace[];
  onSaveSnapshot: (places: ResolvedPlace[]) => void;
  onClearSnapshot: () => void;
}) {
  const loadingStatus = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const map = useMap();

  const [hqPlace, setHqPlace] = useState<ResolvedPlace | null>(null);
  const [partnerPlaces, setPartnerPlaces] = useState<ResolvedPlace[]>([]);
  const [searchResults, setSearchResults] = useState<ResolvedPlace[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');
  const [mapError, setMapError] = useState(false);

  // Trigger quota banner on Maps auth failure
  useEffect(() => {
    if (loadingStatus === APILoadingStatus.AUTH_FAILURE) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      setMapError(true);
    } else if (loadingStatus === APILoadingStatus.FAILED) {
      setMapError(true);
    }
  }, [loadingStatus]);

  // Resolve Headquarters coordinates from Places API (New) rather than hardcoded coordinates
  useEffect(() => {
    if (!placesLib) return;
    let active = true;

    async function resolveHeadquarters() {
      try {
        const request: google.maps.places.SearchByTextRequest = {
          textQuery: HQ_QUERY,
          fields: ['id', 'displayName', 'formattedAddress', 'location'],
          language: lang,
          maxResultCount: 1,
        };
        const { places } = await placesLib!.Place.searchByText(request);
        if (!active) return;

        const first = places?.[0];
        const loc = first?.location;
        if (first && loc) {
          const resolved: ResolvedPlace = {
            id: first.id,
            name: first.displayName ?? t.hqLabel,
            address: first.formattedAddress ?? 'Kolwezi, Lualaba, DRC',
            position: { lat: loc.lat(), lng: loc.lng() },
          };
          setHqPlace(resolved);
          setSelectedId(resolved.id);
        } else {
          setMapError(true);
        }
      } catch (err) {
        if (!active) return;
        if (isQuotaOrAuthError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setMapError(true);
      }
    }

    void resolveHeadquarters();

    return () => {
      active = false;
    };
  }, [placesLib, lang, t.hqLabel]);

  const handlePlaceSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (!trimmed || !placesLib) return;

      setIsSearching(true);
      setStatusFeedback('');

      try {
        const request: google.maps.places.SearchByTextRequest = {
          textQuery: trimmed,
          fields: ['id', 'displayName', 'formattedAddress', 'location'],
          ...(hqPlace ? { locationBias: hqPlace.position } : {}),
          language: lang,
          maxResultCount: 4,
        };
        const { places } = await placesLib.Place.searchByText(request);
        const mapped: ResolvedPlace[] = (places ?? [])
          .filter((p) => p.location != null)
          .map((p) => ({
            id: p.id,
            name: p.displayName ?? trimmed,
            address: p.formattedAddress ?? '',
            position: { lat: p.location!.lat(), lng: p.location!.lng() },
          }));

        if (mapped.length === 0) {
          setSearchResults([]);
          setStatusFeedback(t.noResultsLabel);
          return;
        }

        setSearchResults(mapped);
        setSelectedId(mapped[0].id);
        if (map) {
          map.panTo(mapped[0].position);
          map.setZoom(13);
        }
      } catch (err) {
        if (isQuotaOrAuthError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setStatusFeedback(t.unavailableLabel);
      } finally {
        setIsSearching(false);
      }
    },
    [searchQuery, placesLib, hqPlace, lang, map, t.noResultsLabel, t.unavailableLabel]
  );

  // Locate partner venue in Dilala via live Google Maps Places API (New)
  const handleAddPartner = useCallback(async () => {
    if (!placesLib || isAddingPartner) return;
    setIsAddingPartner(true);
    setStatusFeedback('');

    try {
      let places: google.maps.places.Place[] = [];
      const primaryReq: google.maps.places.SearchByTextRequest = {
        textQuery: PARTNER_PRIMARY_QUERY,
        fields: ['id', 'displayName', 'formattedAddress', 'location'],
        ...(hqPlace ? { locationBias: hqPlace.position } : {}),
        language: lang,
        maxResultCount: 1,
      };
      const primaryRes = await placesLib.Place.searchByText(primaryReq);
      places = primaryRes.places ?? [];

      if (places.length === 0) {
        const fallbackReq: google.maps.places.SearchByTextRequest = {
          textQuery: PARTNER_FALLBACK_QUERY,
          fields: ['id', 'displayName', 'formattedAddress', 'location'],
          ...(hqPlace ? { locationBias: hqPlace.position } : {}),
          language: lang,
          maxResultCount: 1,
        };
        const fallbackRes = await placesLib.Place.searchByText(fallbackReq);
        places = fallbackRes.places ?? [];
      }

      const target = places[0];
      if (!target || !target.location) {
        setStatusFeedback(t.noResultsLabel);
        return;
      }

      const partner: ResolvedPlace = {
        id: target.id,
        name: target.displayName ?? 'Dilala Partner Hub',
        address: target.formattedAddress ?? 'Dilala, Kolwezi',
        position: { lat: target.location.lat(), lng: target.location.lng() },
        isPartner: true,
      };

      setPartnerPlaces((prev) =>
        prev.some((p) => p.id === partner.id) ? prev : [...prev, partner]
      );
      setSelectedId(partner.id);
      if (map) {
        map.panTo(partner.position);
        map.setZoom(14);
      }
      setStatusFeedback(t.partnerAddedFeedback);
    } catch (err) {
      if (isQuotaOrAuthError(err)) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      setStatusFeedback(t.unavailableLabel);
    } finally {
      setIsAddingPartner(false);
    }
  }, [placesLib, isAddingPartner, hqPlace, lang, map, t]);

  const handleSaveOfflineSnapshot = () => {
    const combined: ResolvedPlace[] = [];
    const seen = new Set<string>();
    for (const item of [hqPlace, ...partnerPlaces, ...searchResults]) {
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }
    if (combined.length > 0) {
      onSaveSnapshot(combined);
      setStatusFeedback(t.offlineSavedFeedback);
    }
  };

  const handleRecenterHq = () => {
    if (!hqPlace) return;
    setSelectedId(hqPlace.id);
    if (map) {
      map.panTo(hqPlace.position);
      map.setZoom(13);
    }
  };

  const allExtraPlaces = [...partnerPlaces, ...searchResults].filter(
    (item, idx, arr) =>
      item.id !== hqPlace?.id && arr.findIndex((x) => x.id === item.id) === idx
  );

  const activePlace =
    allExtraPlaces.find((p) => p.id === selectedId) ??
    (hqPlace && selectedId === hqPlace.id ? hqPlace : hqPlace);

  if (mapError || !isOnline) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0C0C0C] p-6 text-center min-h-[240px]">
          <MapPin className="h-8 w-8 text-[#D4AF37]" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-neutral-200">{t.unavailableLabel}</p>
          <p className="mt-1 text-xs text-neutral-400">{t.missingKeyNote}</p>
          <a
            href={EXTERNAL_MAPS_FALLBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-outline-pill mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold"
          >
            <span>{t.openExternalBtn}</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
          </a>
        </div>

        {cachedPlaces.length > 0 && (
          <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#0E0E0E] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#D4AF37]">
                {t.savedLocationsTitle}
              </span>
              <button
                type="button"
                onClick={onClearSnapshot}
                className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.clearCacheBtn}</span>
              </button>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {cachedPlaces.map((place) => (
                <li
                  key={place.id}
                  className="rounded-xl border border-white/10 bg-black/50 p-3 text-xs"
                >
                  <div className="font-semibold text-white">{place.name}</div>
                  {place.address && (
                    <div className="mt-0.5 text-neutral-400">{place.address}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Map Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handlePlaceSearch} className="flex flex-1 items-center gap-2">
          <div className="flex min-h-[44px] flex-1 items-center rounded-full border border-white/15 bg-[#0D0D0D] px-4 transition-colors focus-within:border-[#D4AF37]">
            <Search className="me-2.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full bg-transparent py-2 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !placesLib}
            className="gold-pill-btn inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold whitespace-nowrap cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            {isSearching && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
            <span>{isSearching ? t.searchingLabel : t.searchBtn}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-[#0D0D0D] p-1">
            <button
              type="button"
              onClick={() => setMapTypeId('roadmap')}
              className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                mapTypeId === 'roadmap'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.roadmapLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setMapTypeId('hybrid')}
              className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                mapTypeId === 'hybrid'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.satelliteLabel}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRecenterHq}
            disabled={!hqPlace}
            className="gold-outline-pill inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            <Compass className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>{t.recenterBtn}</span>
          </button>

          <a
            href={buildPlaceUrl(activePlace)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-neutral-200 whitespace-nowrap hover:border-[#D4AF37]/50 hover:text-white transition-colors"
          >
            <span>{t.openExternalBtn}</span>
            <ExternalLink
              className={`h-3.5 w-3.5 text-[#D4AF37] ${isRtl ? '-scale-x-100' : ''}`}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      {/* MUANS GO Partner Pinning & Offline Snapshot Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddPartner}
            disabled={!placesLib || isAddingPartner}
            className="gold-outline-pill inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            {isAddingPartner ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" aria-hidden="true" />
            ) : (
              <PlusCircle className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            )}
            <span>{isAddingPartner ? t.addingPartnerLabel : t.addPartnerBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveOfflineSnapshot}
            disabled={!hqPlace}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-neutral-200 whitespace-nowrap hover:border-[#D4AF37]/50 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>{t.saveOfflineBtn}</span>
          </button>
        </div>

        {statusFeedback && (
          <p className="text-xs font-medium text-[#D4AF37]" role="status" aria-live="polite">
            {statusFeedback}
          </p>
        )}
      </div>

      {/* Explicit Sized Map Container (prevents 0x0 collapse per CF2) */}
      <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#0C0C0C]">
        {!hqPlace ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-neutral-300">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" aria-hidden="true" />
            <span className="text-xs sm:text-sm">{t.loadingLabel}</span>
          </div>
        ) : (
          <GoogleMap
            defaultCenter={hqPlace.position}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            mapTypeId={mapTypeId}
            colorScheme={ColorScheme.DARK}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            streetViewControl={false}
            mapTypeControl={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            <PlaceMarkerWithInfoWindow
              place={hqPlace}
              isPrimaryHq
              hqLabel={t.hqLabel}
              openExternalLabel={t.openExternalBtn}
              isSelected={selectedId === hqPlace.id}
              onSelect={() => setSelectedId(hqPlace.id)}
              onClose={() => setSelectedId(null)}
            />

            {allExtraPlaces.map((item) => (
              <PlaceMarkerWithInfoWindow
                key={item.id}
                place={item}
                isPrimaryHq={false}
                hqLabel={t.hqLabel}
                openExternalLabel={t.openExternalBtn}
                isSelected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
                onClose={() => setSelectedId(null)}
              />
            ))}
          </GoogleMap>
        )}
      </div>

      {/* Offline Saved Locations Strip (when cached) */}
      {cachedPlaces.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0D0D0D] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
              <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
              <span>
                {t.savedLocationsTitle} ({cachedPlaces.length})
              </span>
            </div>
            <button
              type="button"
              onClick={onClearSnapshot}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.clearCacheBtn}</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {cachedPlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => {
                  setSelectedId(place.id);
                  if (map) {
                    map.panTo(place.position);
                    map.setZoom(14);
                  }
                }}
                className="rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-neutral-200 hover:border-[#D4AF37]/50 hover:text-white transition-colors cursor-pointer"
              >
                {place.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function KolweziHeadquartersMap({
  t,
  lang,
  isRtl,
}: KolweziHeadquartersMapProps) {
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '').trim();
  const [apiKey, setApiKey] = useState(
    envKey && envKey !== 'MY_GOOGLE_MAPS_API_KEY' ? envKey : ''
  );
  const [resolvedConfig, setResolvedConfig] = useState(Boolean(apiKey));
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [cachedPlaces, setCachedPlaces] = useState<ResolvedPlace[]>(() =>
    readCachedSnapshot()
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (apiKey) {
      setResolvedConfig(true);
      return;
    }

    let mounted = true;
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : { mapsApiKey: '' }))
      .then((data: { mapsApiKey?: string }) => {
        if (!mounted) return;
        const key = (data.mapsApiKey ?? '').trim();
        if (key) {
          setApiKey(key);
        }
        setResolvedConfig(true);
      })
      .catch(() => {
        if (mounted) setResolvedConfig(true);
      });

    return () => {
      mounted = false;
    };
  }, [apiKey]);

  const handleSaveSnapshot = (places: ResolvedPlace[]) => {
    if (writeCachedSnapshot(places)) {
      setCachedPlaces(places);
    }
  };

  const handleClearSnapshot = () => {
    try {
      localStorage.removeItem(OFFLINE_CACHE_KEY);
    } catch {
      // Ignore storage errors
    }
    setCachedPlaces([]);
  };

  return (
    <div className="mt-8 glass-panel rounded-3xl p-6 sm:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            {t.title}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-neutral-300">
            {t.subtitle}
          </p>
        </div>

        {/* Clean Unboxed Connectivity Status (no decorative dots) */}
        <div
          className={`inline-flex shrink-0 items-center gap-2 text-xs font-semibold ${
            isOnline ? 'text-emerald-400' : 'text-amber-400'
          }`}
        >
          {isOnline ? (
            <Wifi className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{isOnline ? t.onlineStatusLabel : t.offlineStatusLabel}</span>
        </div>
      </div>

      {!resolvedConfig ? (
        <div className="flex h-[260px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0C0C0C] text-neutral-300">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" aria-hidden="true" />
          <span className="mt-2 text-xs sm:text-sm">{t.loadingLabel}</span>
        </div>
      ) : apiKey ? (
        <APIProvider
          apiKey={apiKey}
          libraries={['places', 'marker']}
          language={lang}
          region="CD"
        >
          <KolweziMapCanvas
            t={t}
            lang={lang}
            isRtl={isRtl}
            isOnline={isOnline}
            cachedPlaces={cachedPlaces}
            onSaveSnapshot={handleSaveSnapshot}
            onClearSnapshot={handleClearSnapshot}
          />
        </APIProvider>
      ) : (
        <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0C0C0C] p-6 text-center">
          <MapPin className="h-8 w-8 text-[#D4AF37]" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-neutral-200">{t.unavailableLabel}</p>
          <p className="mt-1 text-xs text-neutral-400">{t.missingKeyNote}</p>
          <a
            href={EXTERNAL_MAPS_FALLBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-pill-btn mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold"
          >
            <span>{t.openExternalBtn}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}
